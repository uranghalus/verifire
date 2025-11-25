// app/api/apar/[id]/route.ts
import {
  deleteApar,
  getAparById,
  updateApar,
} from '@/app/(main)/fire-safety/apar/data/action';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const apar = await getAparById(parseInt(params.id));
    if (!apar) {
      return NextResponse.json({ error: 'APAR not found' }, { status: 404 });
    }
    return NextResponse.json(apar);
  } catch (error) {
    console.error('Error fetching APAR:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const apar = await updateApar(parseInt(id), body);
    return NextResponse.json(apar);
  } catch (error) {
    console.error('Error updating APAR:', error);
    return NextResponse.json(
      { error: 'Failed to update APAR' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  console.log('ID:', id);
  await deleteApar(parseInt(id));

  return NextResponse.json({ message: 'APAR deleted successfully' });
}
