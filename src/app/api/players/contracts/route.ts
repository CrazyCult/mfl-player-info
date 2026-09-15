import { NextRequest, NextResponse } from 'next/server';
import { getMflHeaders, MFL_API_BASE_URL } from '@/lib/mfl-api';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const ageMin = searchParams.get('ageMin');
  const ageMax = searchParams.get('ageMax');
  const overallMin = searchParams.get('overallMin');
  const overallMax = searchParams.get('overallMax');
  const position = searchParams.get('position');

  if (!ageMin || !ageMax || !overallMin || !overallMax || !position) {
    return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
  }

  const url = `${MFL_API_BASE_URL}/players?limit=500&ageMin=${ageMin}&ageMax=${ageMax}&overallMin=${overallMin}&overallMax=${overallMax}&positions=${encodeURIComponent(position)}&excludingMflOwned=true&isFreeAgent=false`;

  const res = await fetch(url, {
    headers: getMflHeaders(),
    next: { revalidate: 3600 },
  });

  if (!res.ok) {
    return NextResponse.json([], { status: res.status });
  }

  const data = await res.json();
  return NextResponse.json(data);
}
