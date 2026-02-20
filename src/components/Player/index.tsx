import { BasicInfo } from './BasicInfo';
import { ImageCard } from './ImageCard';
import { GoalkeeperStats } from './GoalkeeperStats';
import { PositionRatings } from './PositionRatings';
import { ContractStats } from './ContractStats';
import { Suspense } from 'react';
import { SpinnerIcon } from '../SpinnerIcon';
import { CareerStats } from './CareerStats';
import type { Player } from '@/types/global.types';
import { ShareCardButton } from './ShareCardButton';
import { PlayerProgression } from './PlayerProgression';
import {
  getProgressionByPlayer,
  getContractComparisonByPlayer,
} from '@/data/players';

type HistoryEntry = {
  date: number;
  values: { age?: number; overall?: number; [key: string]: number | undefined };
};

type DataPoint = { age: number; overall: number };

type ContractInfo = {
  division: number;
  total: number;
  minRevenueShare: number;
  maxRevenueShare: number;
  averageRevenueShare: number;
};

async function ProgressionLoader({ player }: { player: Player }) {
  const history: HistoryEntry[] = await getProgressionByPlayer(player.id);
  let state = { age: 0, overall: 0 };
  const points: DataPoint[] = [];
  for (const entry of history) {
    if (entry.values.age !== undefined) state.age = entry.values.age;
    if (entry.values.overall !== undefined) state.overall = entry.values.overall;
    if (state.age > 0 && state.overall > 0) {
      const last = points[points.length - 1];
      if (!last || last.age !== state.age) {
        points.push({ age: state.age, overall: state.overall });
      } else {
        last.overall = state.overall;
      }
    }
  }
  return <PlayerProgression player={player} initialData={points} />;
}

async function ContractStatsLoader({ player }: { player: Player }) {
  const players = await getContractComparisonByPlayer(player);
  const filtered = players.filter(
    (p) => p.activeContract?.revenueShare !== 0
  );
  const grouped = filtered.reduce((map: Map<number, typeof players>, p) => {
    const div = p.activeContract!.club.division;
    if (!map.has(div)) map.set(div, []);
    map.get(div)!.push(p);
    return map;
  }, new Map());
  const divOrder = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const sorted = new Map(
    [...grouped.entries()].sort(
      (a, b) => divOrder.indexOf(a[0]) - divOrder.indexOf(b[0])
    )
  );
  const info: ContractInfo[] = [];
  sorted.forEach((contracts, division) => {
    const s = [...contracts].sort(
      (a, b) => a.activeContract!.revenueShare - b.activeContract!.revenueShare
    );
    const trim = Math.max(1, Math.floor(s.length * 0.1));
    const trimmed = s.length >= 5 ? s.slice(trim, s.length - trim) : s;
    const avg =
      trimmed.reduce((sum, c) => sum + c.activeContract!.revenueShare, 0) /
      trimmed.length;
    info.push({
      division,
      total: contracts.length,
      minRevenueShare: trimmed[0].activeContract!.revenueShare,
      maxRevenueShare: trimmed[trimmed.length - 1].activeContract!.revenueShare,
      averageRevenueShare: avg,
    });
  });
  return <ContractStats player={player} initialInfo={info} />;
}

export default function Player({ player }: { player: Player }) {
  const isGoalkeeper = player.metadata.positions.includes('GK');

  return (
    <div id='player-share-card' className='bg-card shadow-foreground/5 outline-border @container/main mx-auto w-full max-w-xl transform rounded-xl p-4 shadow-2xl outline-1 -outline-offset-1 sm:p-6 lg:p-8'>
      <div className='grid grid-cols-1 gap-y-8 @sm/main:grid-cols-3 @sm/main:items-center @sm/main:gap-8'>
        <ImageCard player={player} />
        <BasicInfo player={player} />
        <Suspense
          fallback={
            <div className='col-span-3 flex justify-center py-2'>
              <SpinnerIcon className='text-muted size-6 animate-spin' />
            </div>
          }
        >
          <CareerStats player={player} />
        </Suspense>
      </div>
      {isGoalkeeper ? (
        <GoalkeeperStats player={player} />
      ) : (
        <PositionRatings player={player} />
      )}
      <Suspense
        fallback={
          <div className='mt-12 flex justify-center py-4'>
            <SpinnerIcon className='text-muted size-6 animate-spin' />
          </div>
        }
      >
        <ProgressionLoader player={player} />
      </Suspense>
      <Suspense
        fallback={
          <div className='mt-12 flex justify-center py-4'>
            <SpinnerIcon className='text-muted size-6 animate-spin' />
          </div>
        }
      >
        <ContractStatsLoader player={player} />
      </Suspense>
    </div>
  );
}
