'use client';

import { usePlayerQuery } from '@/hooks/usePlayerQuery';
import { GoalkeeperStats } from './GoalkeeperStats';
import { PositionRatings } from './PositionRatings';
import { PlayerCardSVG } from './PlayerCardSVG';
import { Badge } from '../UI/badge';
import Image from 'next/image';
import { PlayerContract } from './PlayerContract';
import { CrownIcon, FlameIcon, InfoIcon, Loader2Icon, ShieldXIcon } from 'lucide-react';
import { ArrowTopRightOnSquareIcon, ArrowsRightLeftIcon } from '@heroicons/react/20/solid';
import Link from 'next/link';
import { Tooltip, TooltipContent, TooltipTrigger } from '../UI/tooltip';
import { getTierClasses, getTierFromOverall } from '@/lib/tier-colors';
import { cn } from '@/utils/helpers';
import { MarketValue } from '@/types/global.types';
import { Button } from '../UI/button';

interface ClientPlayerProps {
  playerId: number;
}

function getMarketValueTooltip(marketValue: MarketValue): string {
  if (marketValue.estimate <= 0) return 'No recent sales data available for market value calculation.';
  return `Value estimate from ${marketValue.method} model with ${marketValue.confidence} confidence.`;
}

export function ClientPlayer({ playerId }: ClientPlayerProps) {
  const { data: player, isLoading, error } = usePlayerQuery(playerId);

  if (isLoading) return <div className='flex items-center justify-center p-8'><Loader2Icon className='size-8 animate-spin' /></div>;
  if (error) return <div className='flex items-center justify-center p-8 text-red-500'>Error loading player data</div>;
  if (!player) return <div className='flex items-center justify-center p-8 text-gray-500'>Player not found</div>;

  const isGoalkeeper = player.metadata.positions.includes('GK');
  const tierTextClasses = getTierClasses(getTierFromOverall(player.metadata.overall));

  return (
    <div className='@container/main'>
      <div className='grid grid-cols-1 gap-y-8 @sm/main:grid-cols-3 @sm/main:items-center @sm/main:gap-8'>
        <div className='relative'>
          <div className='mx-auto w-full max-w-48'>
            <PlayerCardSVG player={player} />
          </div>
          <div className='mt-4 flex items-center justify-center gap-x-1.5'>
            <Button asChild size='sm' variant='secondary'>
              <Link href={{ pathname: '/compare', query: { player1: player.id, player2: '' } }}>
                <ArrowsRightLeftIcon />
              </Link>
            </Button>
            <Button asChild size='sm' variant='secondary'>
              <Link href={`https://app.playmfl.com/players/${player.id}`} target='_blank'>
                <ArrowTopRightOnSquareIcon className='-mr-0.5' />
              </Link>
            </Button>
          </div>
        </div>

        <div className='col-span-2 flex flex-col gap-1'>
          <div className='flex items-center gap-2.5'>
            <h1 className='text-2xl font-bold'>{player.metadata.firstName} {player.metadata.lastName}</h1>
            <Badge variant='secondary' className={cn('border', tierTextClasses)}>#{player.id}</Badge>
          </div>
          <div className='flex items-center gap-1.5'>
            {player.is_burned && <Badge variant='destructive' className='text-[10px] [&>svg]:size-2.5'><FlameIcon className='shrink-0' />Burned</Badge>}
            {player.is_retired && <Badge variant='secondary' className='text-[10px] [&>svg]:size-2.5'><ShieldXIcon className='shrink-0' />Retired</Badge>}
            {(!player.is_retired || !player.is_burned) && <PlayerContract club={player.club} />}
            <Badge variant='outline' className='flex items-center gap-1 text-[10px] [&>svg]:size-2.5'><CrownIcon className='shrink-0' />{player.ownedBy?.name || player.ownedBy?.walletAddress}</Badge>
          </div>

          <div className='mt-3 flex flex-col gap-1.5 text-sm'>
            <div className='flex justify-between'><div className='text-foreground/80 font-medium'>Age</div><div>{player.metadata.age}</div></div>
            <div className='flex justify-between'><div className='text-foreground/80 font-medium'>Height</div><div>{player.metadata.height}cm</div></div>
            <div className='flex justify-between'><div className='text-foreground/80 font-medium'>Position</div><div>{player.metadata.positions[0]}</div></div>
            <div className='flex justify-between'>
              <div className='text-foreground/80 font-medium'>Nation</div>
              <div className='flex items-center gap-1.5'>
                <Image src={`https://app.playmfl.com/img/flags/${player.metadata.nationalities[0]}.svg`} alt={player.metadata.nationalities[0]} width={20} height={20} className='size-4 rounded-sm' unoptimized />
                <span>{player.metadata.nationalities[0].replace('_', ' ').toLowerCase()}</span>
              </div>
            </div>
            <div className='flex justify-between'><div className='text-foreground/80 font-medium'>Foot</div><div className='capitalize'>{player.metadata.preferredFoot.toLowerCase()}</div></div>
            <div className='flex items-start justify-between'>
              <div className='text-foreground/80 flex items-center gap-1.5 font-medium'>
                Est. Value
                <Tooltip>
                  <TooltipTrigger tabIndex={-1}><InfoIcon className='text-foreground/80 size-4' /></TooltipTrigger>
                  <TooltipContent className='max-w-[280px]'><p className='text-center'>{player.marketValue ? getMarketValueTooltip(player.marketValue) : 'Not enough data to calculate market value.'}</p></TooltipContent>
                </Tooltip>
              </div>
              <div className='font-medium'>{player.marketValue ? `~$${player.marketValue.estimate}` : 'Unavailable'}</div>
            </div>
          </div>
        </div>
      </div>

      {isGoalkeeper ? <GoalkeeperStats player={player} /> : <PositionRatings player={player} />}
    </div>
  );
}
