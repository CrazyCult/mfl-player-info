import 'server-only';

export const MFL_API_BASE_URL =
  'https://z519wdyajg.execute-api.us-east-1.amazonaws.com/prod';

export function getMflHeaders(): HeadersInit {
  const token = process.env.MFL_API_TOKEN;
  if (!token) throw new Error('MFL_API_TOKEN environment variable is not set');
  return { 'X-MFL-Api-Token': token };
}

export async function mflFetch(
  path: string,
  init: RequestInit = {}
): Promise<Response> {
  const { headers: existingHeaders, ...rest } = init;
  return fetch(`${MFL_API_BASE_URL}${path}`, {
    ...rest,
    headers: {
      ...getMflHeaders(),
      ...(existingHeaders && !Array.isArray(existingHeaders)
        ? (existingHeaders as Record<string, string>)
        : {}),
    },
  });
}
