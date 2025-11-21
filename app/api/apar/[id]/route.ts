/* eslint-disable @typescript-eslint/no-explicit-any */
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

interface Params {
  params: { id: string };
}

export async function GET(request: Request, { params }: Params) {
  try {
    const id = parseInt(params.id);
    const item = await prisma.apar.findUnique({ where: { id } });
    if (!item)
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(item);
  } catch (err) {
    return NextResponse.json({ error: err }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: Params) {
  try {
    const id = parseInt(params.id);
    const body = await request.json();
    const updated = await prisma.apar.update({ where: { id }, data: body });
    return NextResponse.json(updated);
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message ?? 'Update failed' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request, { params }: Params) {
  try {
    const id = parseInt(params.id);
    await prisma.apar.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: err }, { status: 500 });
  }
}
