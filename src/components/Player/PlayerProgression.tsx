'use client';
import { useState } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/solid';
import { SpinnerIcon } from '../SpinnerIcon';
import { Player } from '@/types/global.types';

type HistoryEntry = {
  date: number;
  values: { age?: number; overall?: number; [key: string]: number | undefined };
};

type DataPoint = { age: number; overall: number };

export function PlayerProgression({ player }: { player: Player }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<DataPoint[] | null>(null);

  async function handleOpen() {
    if (open) { setOpen(false); return; }
    setOpen(true);
    if (data) return;
    setLoading(true);
    try {
      const res = await fetch(
        `https://z519wdyajg.execute-api.us-east-1.amazonaws.com/prod/players/${player.id}/experiences/history`
      );
      const history: HistoryEntry[] = await res.json();
      // Reconstituer l etat a chaque entree
      let state: { age: number; overall: number } = { age: 0, overall: 0 };
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
      setData(points);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  }

  const minOvr = data ? Math.min(...data.map(d => d.overall)) - 3 : 0;
  const maxOvr = data ? Math.max(...data.map(d => d.overall)) + 3 : 0;
  const minAge = data ? data[0].age : 0;
  const maxAge = data ? data[data.length - 1].age : 0;
  const W = 500, H = 120, PAD = 8;

  function toX(age: number) {
    return PAD + ((age - minAge) / Math.max(maxAge - minAge, 1)) * (W - PAD * 2);
  }
  function toY(ovr: number) {
    return H - PAD - ((ovr - minOvr) / Math.max(maxOvr - minOvr, 1)) * (H - PAD * 2);
  }

  const pathD = data ? data.map((d, i) =>
    (i === 0 ? 'M' : 'L') + toX(d.age).toFixed(1) + ' ' + toY(d.overall).toFixed(1)
  ).join(' ') : '';

  const areaD = data ? pathD + ` L${toX(maxAge).toFixed(1)} ${H} L${toX(minAge).toFixed(1)} ${H} Z` : '';

  return (
    <div className='mt-12'>
      <button onClick={handleOpen} className='flex w-full items-center justify-between text-left'>
        <h2 className='text-2xl font-bold tracking-tight sm:text-3xl'>Progression</h2>
        <ChevronDownIcon className={`text-muted-foreground size-6 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className='mt-4'>
          {loading ? (
            <div className='flex justify-center py-8'>
              <SpinnerIcon className='text-muted size-6 animate-spin' />
            </div>
          ) : data && data.length > 1 ? (
            <div className='border-border rounded-lg border p-4'>
              <svg viewBox={`0 0 ${W} ${H}`} className='w-full' style={{ height: '160px' }}>
                <defs>
                  <linearGradient id='progGrad' x1='0' y1='0' x2='0' y2='1'>
                    <stop offset='0%' stopColor='currentColor' stopOpacity='0.2' className='text-primary' />
                    <stop offset='100%' stopColor='currentColor' stopOpacity='0' className='text-primary' />
                  </linearGradient>
                </defs>
                {/* Grid lines */}
                {[minOvr, Math.round((minOvr + maxOvr) / 2), maxOvr].map(v => (
                  <g key={v}>
                    <line x1={PAD} y1={toY(v)} x2={W - PAD} y2={toY(v)} stroke='currentColor' strokeOpacity='0.1' strokeWidth='1' className='text-foreground' />
                    <text x={PAD} y={toY(v) - 3} fontSize='9' fill='currentColor' opacity='0.4' className='text-foreground'>{v}</text>
                  </g>
                ))}
                {/* Area */}
                <path d={areaD} fill='url(#progGrad)' />
                {/* Line */}
                <path d={pathD} fill='none' stroke='currentColor' strokeWidth='2' className='text-primary' />
                {/* Points + age labels */}
                {data.map((d, i) => (
                  <g key={i}>
                    <circle cx={toX(d.age)} cy={toY(d.overall)} r='3' fill='currentColor' className='text-primary' />
                    <text x={toX(d.age)} y={H - 1} fontSize='9' fill='currentColor' opacity='0.5' textAnchor='middle' className='text-foreground'>{d.age}</text>
                  </g>
                ))}
              </svg>
            </div>
          ) : (
            <p className='text-muted-foreground py-4 text-center'>No progression data available.</p>
          )}
        </div>
      )}
    </div>
  );
}
