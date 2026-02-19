'use client';

import { useQuery } from '@tanstack/react-query';
import { PlayerWithFavouriteData } from '@/app/players-table/types';

async function fetchPlayer(id: number): Promise<PlayerWithFavouriteData | null> {
  const res = await fetch(
    `https://z519wdyajg.execute-api.us-east-1.amazonaws.com/prod/players/${id}`
  );

  if (!res.ok) return null;

  const payload = await res.json();
  const player = payload?.player;

  if (!player) return null;

  return {
    ...player,
    is_favourite: false,
    tags: [],
    is_burned: player.is_burned || false,
    is_retired: player.is_retired || false,
  } as PlayerWithFavouriteData;
}

export function usePlayerQuery(id: number) {
  return useQuery({
    queryKey: ['player', id],
    queryFn: () => fetchPlayer(id),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    enabled: !!id,
  });
}
