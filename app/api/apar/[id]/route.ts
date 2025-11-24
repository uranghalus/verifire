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
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const apar = await updateApar(parseInt(params.id), body);
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
  { params }: { params: { id: string } }
) {
  try {
    await deleteApar(parseInt(params.id));
    return NextResponse.json({ message: 'APAR deleted successfully' });
  } catch (error) {
    console.error('Error deleting APAR:', error);
    return NextResponse.json(
      { error: 'Failed to delete APAR' },
      { status: 500 }
    );
  }
}
