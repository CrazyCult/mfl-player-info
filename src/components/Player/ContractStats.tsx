'use client';
import { useState } from 'react';
import { Player } from '@/types/global.types';
import { InformationCircleIcon, ChevronDownIcon } from '@heroicons/react/24/solid';
import { SpinnerIcon } from '../SpinnerIcon';

function Division({ division }: { division: number }) {
  const divisionClasses: { [key: number]: string } = {
    1: 'bg-[#3be9f8]', 2: 'bg-[#13d389]', 3: 'bg-[#ffd23e]',
    4: 'bg-[#f3f3f3]', 5: 'bg-[#fd7a00]', 6: 'bg-[#865e3f]',
    7: 'bg-[#71717a]', 8: 'bg-[#82a1b7]', 9: 'bg-[#ffd939]', 10: 'bg-[#757061]',
  };
  const divisionNames: { [key: number]: string } = {
    1: 'Diamond', 2: 'Platinum', 3: 'Gold', 4: 'Silver', 5: 'Bronze',
    6: 'Iron', 7: 'Stone', 8: 'Ice', 9: 'Spark', 10: 'Flint',
  };
  return (
    <span className='flex items-center space-x-2'>
      <span className={`h-4 w-4 rounded-full ${divisionClasses[division]}`}></span>
      <span>{divisionNames[division]}</span>
    </span>
  );
}

function formatPercentage(value: number) {
  return new Intl.NumberFormat('default', {
    style: 'percent', minimumFractionDigits: 1, maximumFractionDigits: 2,
  }).format(value / 100 / 100);
}

export function ContractStats({ player }: { player: Player }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [contractInfo, setContractInfo] = useState<any[] | null>(null);

  async function handleOpen() {
    if (open) { setOpen(false); return; }
    setOpen(true);
    if (contractInfo) return;
    setLoading(true);
    try {
      const res = await fetch(
        `https://z519wdyajg.execute-api.us-east-1.amazonaws.com/prod/players?limit=500&ageMin=${player.metadata.age - 2}&ageMax=${player.metadata.age + 2}&overallMin=${player.metadata.overall - 2}&overallMax=${player.metadata.overall + 2}&positions=${player.metadata.positions[0]}&excludingMflOwned=true&isFreeAgent=false`
      );
      const players: Player[] = await res.json();
      const filtered = players.filter(p => p.activeContract?.revenueShare !== 0);
      const grouped = filtered.reduce((map, p) => {
        const div = p.activeContract!.club.division;
        if (!map.has(div)) map.set(div, []);
        map.get(div).push(p);
        return map;
      }, new Map());
      const divOrder = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
      const sorted = new Map([...grouped.entries()].sort((a, b) => divOrder.indexOf(a[0]) - divOrder.indexOf(b[0])));
      const info: any[] = [];
      sorted.forEach((contracts, division) => {
        const s = [...contracts].sort((a: Player, b: Player) => a.activeContract!.revenueShare - b.activeContract!.revenueShare);
        const trim = Math.max(1, Math.floor(s.length * 0.1));
        const trimmed = s.length >= 5 ? s.slice(trim, s.length - trim) : s;
        const avg = trimmed.reduce((sum: number, c: Player) => sum + c.activeContract!.revenueShare, 0) / trimmed.length;
        info.push({
          division,
          total: contracts.length,
          minRevenueShare: trimmed[0].activeContract.revenueShare,
          maxRevenueShare: trimmed[trimmed.length - 1].activeContract.revenueShare,
          averageRevenueShare: avg,
        });
      });
      setContractInfo(info);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  }

  return (
    <div className='mt-12'>
      <button onClick={handleOpen} className='flex w-full items-center justify-between text-left'>
        <h2 className='flex items-center space-x-2 text-2xl font-bold tracking-tight sm:text-3xl'>
          <span>Contract Info</span>
          <div className='group relative flex justify-center'>
            <InformationCircleIcon className='text-muted-foreground size-6' />
            <span className='bg-background text-foreground shadow-foreground/2 absolute bottom-8 w-48 scale-0 rounded-lg p-2 text-center text-xs normal-case shadow-xl transition-all group-hover:scale-100'>
              Based on revenue share on active contracts for players of similar age, rating and position.
            </span>
          </div>
        </h2>
        <ChevronDownIcon className={`text-muted-foreground size-6 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className='mt-4'>
          {loading ? (
            <div className='flex justify-center py-8'>
              <SpinnerIcon className='text-muted size-6 animate-spin' />
            </div>
          ) : contractInfo && contractInfo.length > 0 ? (
            <div className='divide-border grid divide-y'>
              <div className='grid grid-cols-[1fr_4rem_4rem_4rem]'>
                <div></div>
                {['Min', 'Avg', 'Max'].map(h => (
                  <div key={h} className='text-muted-foreground px-1.5 py-1 text-center text-sm font-semibold tracking-wide whitespace-nowrap uppercase sm:px-2 sm:text-base'>{h}</div>
                ))}
              </div>
              {contractInfo.map(({ division, total, minRevenueShare, maxRevenueShare, averageRevenueShare }) => (
                <div className='grid grid-cols-[1fr_4rem_4rem_4rem]' key={division}>
                  <div className='w-full px-1.5 py-4 text-left font-medium whitespace-nowrap sm:px-2 sm:pl-1'>
                    <div className='flex items-center space-x-1'>
                      <Division division={division} />
                      <span title='Total Players'>({total})</span>
                    </div>
                  </div>
                  <div className='px-1.5 py-4 text-center font-medium whitespace-nowrap sm:px-2'>{formatPercentage(minRevenueShare)}</div>
                  <div className='px-1.5 py-4 text-center font-medium whitespace-nowrap sm:px-2'>{formatPercentage(averageRevenueShare)}</div>
                  <div className='px-1.5 py-4 text-center font-medium whitespace-nowrap sm:px-2'>{formatPercentage(maxRevenueShare)}</div>
                </div>
              ))}
            </div>
          ) : (
            <p className='text-muted-foreground py-4 text-center'>No contract data available.</p>
          )}
        </div>
      )}
    </div>
  );
}

