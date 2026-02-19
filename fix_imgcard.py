content = open("src/components/Player/ImageCard.tsx", "r", encoding="utf-8").read()
old = """import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowTopRightOnSquareIcon,
  ArrowsRightLeftIcon,
} from '@heroicons/react/20/solid';
import { Suspense } from 'react';
import { ForSale } from './ForSale';
import { PlayerContract } from './PlayerContract';
import { Player } from '@/types/global.types';
import { Button } from '../UI/Button';"""
new = """import Image from 'next/image';
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
import { ShareCardButton } from './ShareCardButton';"""
old2 = """        <Button asChild size='sm' variant='secondary'>
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
        <Button asChild size='sm' variant='secondary'>
          <Link
            href={`https://app.playmfl.com/players/${player.id}`}
            target='_blank'
          >
            <ArrowTopRightOnSquareIcon className='-mr-0.5' />
          </Link>
        </Button>"""
new2 = """        <Button asChild size='sm' variant='secondary'>
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
        </Button>"""
result = content.replace(old, new).replace(old2, new2)
print("OK" if result != content else "NO MATCH")
open("src/components/Player/ImageCard.tsx", "w", encoding="utf-8").write(result)
