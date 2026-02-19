import { ClientPlayerPage } from '@/components/Player/ClientPlayerPage';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { openGraph, twitter } from '@/app/shared-meta';
import { getPlayerById } from '@/data/players';

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export const experimental_ppr = true;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const id = parseInt((await params).id, 10);

  const player = await getPlayerById(id).catch(() => null);

  if (!player) return notFound();

  const title = `${player.metadata.firstName} ${player.metadata.lastName} | #${id} | MFL Player Info`;
  const url = `${process.env.NEXT_PUBLIC_SITE_URL}/player/${id}`;

  return {
    title,
    alternates: {
      canonical: url,
    },
    openGraph: {
      ...openGraph,
      title,
      url,
    },
    twitter: {
      ...twitter,
      title,
    },
  };
}

export default async function PlayerPage({ params }: Props) {
  const id = parseInt((await params).id, 10);

  return <ClientPlayerPage playerId={id} />;
}
