import { NextRequest, NextResponse } from 'next/server';
import { getMflHeaders, MFL_API_BASE_URL } from '@/lib/mfl-api';

export const revalidate = 15;

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const name = searchParams.get('name') ?? '';

  const url = `${MFL_API_BASE_URL}/players?limit=10&sorts=metadata.overall&sortsOrders=DESC&name=${encodeURIComponent(name)}&excludingMflOwned=false`;

  const res = await fetch(url, {
    headers: getMflHeaders(),
    next: { revalidate: 15 },
  });

  if (!res.ok) {
    return NextResponse.json([], { status: res.status });
  }

  const data = await res.json();
  return NextResponse.json(data);
}
