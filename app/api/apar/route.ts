// app/api/apar/route.ts
import { createApar, getApar } from '@/app/(main)/fire-safety/apar/data/action';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const lantai = searchParams.get('lantai') || '';
    const jenis = searchParams.get('jenis') || '';
    const size = searchParams.get('size') || '';

    const result = await getApar({
      page,
      limit,
      search,
      lantai,
      jenis,
      size,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching APAR:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const apar = await createApar(body);
    return NextResponse.json(apar, { status: 201 });
  } catch (error) {
    console.error('Error creating APAR:', error);
    return NextResponse.json(
      { error: 'Failed to create APAR' },
      { status: 500 }
    );
  }
}
