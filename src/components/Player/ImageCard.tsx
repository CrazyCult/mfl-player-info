import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowTopRightOnSquareIcon,
  ArrowsRightLeftIcon,
} from '@heroicons/react/20/solid';
import { Suspense } from 'react';
import { ForSale } from './ForSale';
import { PlayerContract } from './PlayerContract';
import { Player } from '@/types/global.types';
import { Button } from '../UI/Button';
import { ShareCardButton } from './ShareCardButton';

export function ImageCard({ player }: { player: Player }) {
  return (
    <div className='@container/image mx-auto w-full max-w-xs @sm:mx-0'>
      <Image
        className='mx-auto -mt-2 w-full max-w-[200px] px-2 @sm:max-w-none'
        src={`https://d13e14gtps4iwl.cloudfront.net/players/v2/${player.id}/card.png`}
        alt={`Player ${player.id} - ${player.metadata.firstName} ${player.metadata.lastName}`}
        width='512'
        height='748'
        unoptimized
        priority
      />
      <div className='mt-3 flex flex-col items-center justify-center gap-1'>
        <PlayerContract player={player} />
        <Suspense>
          <ForSale player={player} />
        </Suspense>
      </div>
      <div className='mt-4 flex items-center justify-center space-x-1.5'>
        <Button asChild size='sm' variant='secondary'>
          <Link
            href={{
              pathname: '/compare',
              query: {
                player1: player.id,
                player2: '',
              },
            }}
          >
            <ArrowsRightLeftIcon className='h-4 w-4' />
          </Link>
        </Button>
        <ShareCardButton playerId={player.id} />
        <Button asChild size='sm' variant='secondary'>
          <Link
            href={`https://app.playmfl.com/players/${player.id}`}
            target='_blank'
          >
            <ArrowTopRightOnSquareIcon className='-mr-0.5' />
          </Link>
        </Button>
      </div>
    </div>
  );
}


