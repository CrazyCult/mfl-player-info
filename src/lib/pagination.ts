import 'server-only';
import { Listing, Player } from '@/types/global.types';
import { getMflHeaders, MFL_API_BASE_URL } from '@/lib/mfl-api';

async function simpleFetch<T>(url: string): Promise<T> {
  try {
    const response = await fetch(url, { headers: getMflHeaders() });
    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        throw new Error(
          `MFL API authentication failed (${response.status}): check MFL_API_TOKEN`
        );
      }
      if (response.status === 429) {
        throw new Error(
          'MFL API rate limit exceeded (429): too many requests, slow down'
        );
      }
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`API call failed: ${url}`, error);
    throw error;
  }
}


const PAGINATION_CONFIG = {
  maxPages: 20,
  defaultLimit: 50,
  maxRetries: 3,
} as const;

export async function fetchAllPages<T extends Record<string, any>>(
  baseEndpoint: string,
  params: Record<string, string | number | boolean> = {},
  options: {
    maxPages?: number;
    limit?: number;
    idField?: string;
  } = {}
): Promise<T[]> {
  const {
    maxPages = PAGINATION_CONFIG.maxPages,
    limit = PAGINATION_CONFIG.defaultLimit,
    idField = 'beforeId',
  } = options;

  const allResults: T[] = [];
  let currentParams = { ...params, limit };
  let pageCount = 0;

  while (pageCount < maxPages) {
    try {
      const queryString = new URLSearchParams(
        Object.entries(currentParams).map(([key, value]) => [key, String(value)])
      ).toString();

      const endpoint = `${baseEndpoint}${queryString ? `?${queryString}` : ''}`;

      console.log(`Fetching page ${pageCount + 1} from: ${endpoint}`);

      const fullUrl = `${MFL_API_BASE_URL}${endpoint}`;
      const results: T[] = await simpleFetch<T[]>(fullUrl);

      if (!results || results.length === 0) {
        console.log(`No more results found on page ${pageCount + 1}. Stopping pagination.`);
        break;
      }

      allResults.push(...results);
      pageCount++;

      if (results.length < limit) {
        console.log(`Received ${results.length} results (less than limit ${limit}). Last page reached.`);
        break;
      }

      const lastItem = results[results.length - 1];

      let idValue: number | undefined;
      if (idField === 'beforeListingId' && 'listingResourceId' in lastItem) {
        idValue = lastItem.listingResourceId;
      } else if (idField === 'beforePlayerId' && 'id' in lastItem) {
        idValue = lastItem.id;
      } else if ('id' in lastItem) {
        idValue = lastItem.id;
      }

      if (idValue) {
        (currentParams as any)[idField] = idValue;
      } else {
        console.warn('Last item missing ID field for pagination. Stopping.');
        break;
      }

      await new Promise(resolve => setTimeout(resolve, 100));

    } catch (error) {
      console.error(`Error fetching page ${pageCount + 1}:`, error);

      if (allResults.length > 0) {
        console.warn(`Returning ${allResults.length} results despite pagination error.`);
        break;
      }

      throw error;
    }
  }

  if (pageCount >= maxPages) {
    console.warn(`Pagination stopped after reaching maximum pages (${maxPages}). Results may be incomplete.`);
  }

  console.log(`Pagination complete. Fetched ${allResults.length} total results across ${pageCount} pages.`);
  return allResults;
}

export async function fetchAllPlayerSales(
  ageMin: number,
  ageMax: number,
  overallMin: number,
  overallMax: number,
  positions: string,
  options: {
    maxPages?: number;
    includeAll?: boolean;
  } = {}
): Promise<Listing[]> {
  const { maxPages = 10, includeAll = false } = options;

  const params = {
    limit: 50,
    status: 'BOUGHT',
    type: 'PLAYER',
    ageMin,
    ageMax,
    overallMin,
    overallMax,
    positions,
    ...(includeAll ? {} : { marketplace: 'all' }),
  };

  return fetchAllPages<Listing>(
    '/listings',
    params,
    {
      maxPages,
      limit: 50,
      idField: 'beforeListingId',
    }
  );
}

export async function fetchRecentSalesFeed(
  options: {
    maxPages?: number;
    daysBack?: number;
  } = {}
): Promise<Listing[]> {
  const { maxPages = 20, daysBack = 30 } = options;

  const cutoffDate = Date.now() - (daysBack * 24 * 60 * 60 * 1000);

  const allSales: Listing[] = [];
  let pageCount = 0;
  let beforeListingId: number | undefined;

  while (pageCount < maxPages) {
    try {
      const params: Record<string, string | number> = {
        limit: 25,
      };

      if (beforeListingId) {
        params.beforeListingId = beforeListingId;
      }

      const queryString = new URLSearchParams(
        Object.entries(params).map(([key, value]) => [key, String(value)])
      ).toString();

      const fullUrl = `${MFL_API_BASE_URL}/listings/feed?${queryString}`;
      const results: Listing[] = await simpleFetch<Listing[]>(fullUrl);

      if (!results || results.length === 0) {
        break;
      }

      const recentSales = results.filter(sale => {
        return sale.purchaseDateTime && sale.purchaseDateTime > cutoffDate;
      });

      if (recentSales.length === 0) {
        console.log(`No recent sales found in page ${pageCount + 1}. Stopping feed fetch.`);
        break;
      }

      allSales.push(...recentSales);

      if (recentSales.length < results.length) {
        console.log(`Reached sales older than ${daysBack} days. Stopping feed fetch.`);
        break;
      }

      beforeListingId = results[results.length - 1]?.listingResourceId;
      pageCount++;

      await new Promise(resolve => setTimeout(resolve, 100));

    } catch (error) {
      console.error(`Error fetching sales feed page ${pageCount + 1}:`, error);
      break;
    }
  }

  console.log(`Fetched ${allSales.length} recent sales from the last ${daysBack} days.`);
  return allSales;
}
