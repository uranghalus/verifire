import prisma from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const apar = await prisma.apar.findUnique({
      where: { id: parseInt(id) },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!apar) {
      return NextResponse.json({ error: 'APAR not found' }, { status: 404 });
    }

    return NextResponse.json(apar);
  } catch (error) {
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
    const apar = await prisma.apar.update({
      where: { id: parseInt(id) },
      data: {
        kode_apar: body.kode_apar,
        lantai: body.lantai,
        lokasi: body.lokasi,
        jenis: body.jenis,
        size: body.size,
        userId: body.userId || null,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

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

  await prisma.apar.delete({
    where: { id: parseInt(id) },
  });

  return NextResponse.json({ message: 'APAR deleted successfully' });
}
