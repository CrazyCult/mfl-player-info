import { unstable_cache, revalidateTag } from 'next/cache';
import 'server-only';
import { getMflHeaders } from '@/lib/mfl-api';

export const CACHE_KEYS = {
  PLAYER_SALES: (playerId: number) => `player-sales-${playerId}`,
  MARKET_VALUE: (playerId: number) => `market-value-${playerId}`,
} as const;

export const CACHE_TTL = {
  RAW_SALES_DATA: 300, // 5 minutes
  MARKET_VALUES: 3600, // 1 hour
} as const;

export async function cachedFetch<T>(
  url: string,
  options: {
    tags: string[];
    revalidate: number;
    init?: RequestInit;
  }
): Promise<T> {
  const response = await fetch(url, {
    ...options.init,
    headers: {
      ...getMflHeaders(),
      ...(options.init?.headers as Record<string, string> | undefined),
    },
    next: {
      revalidate: options.revalidate,
      tags: options.tags,
    },
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

export function cacheMarketValue<T>(
  playerId: number,
  calculator: () => Promise<T>,
  tags?: string[]
): Promise<T> {
  return unstable_cache(
    calculator,
    [`market-value-${playerId}`],
    {
      tags: tags || [CACHE_KEYS.MARKET_VALUE(playerId)],
      revalidate: CACHE_TTL.MARKET_VALUES,
    }
  )();
}
