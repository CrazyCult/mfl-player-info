import { NextRequest, NextResponse } from 'next/server';
import { getMflHeaders, MFL_API_BASE_URL } from '@/lib/mfl-api';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'Missing player id' }, { status: 400 });
  }

  const res = await fetch(
    `${MFL_API_BASE_URL}/players/${id}/experiences/history`,
    {
      headers: getMflHeaders(),
      next: { revalidate: 3600 },
    }
  );

  if (!res.ok) {
    return NextResponse.json([], { status: res.status });
  }

  const data = await res.json();
  return NextResponse.json(data);
}
