/* eslint-disable @typescript-eslint/no-explicit-any */
import { auth } from '@/lib/auth';
import { getServerSession } from '@/lib/get-session';
import prisma from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession();
    const userId = session?.user?.id;
    const hasPermission = await auth.api.userHasPermission({
      body: {
        userId: userId,
        permission: {
          apar: ['view'],
        },
      },
    });

    if (hasPermission.success === false) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get('page') ?? '1', 10);
    const pageSize = parseInt(url.searchParams.get('pageSize') ?? '10', 10);
    const search = url.searchParams.get('search') ?? undefined;
    const lantai = url.searchParams.get('lantai') ?? undefined;
    const jenis = url.searchParams.get('jenis') ?? undefined;
    const sizeMin = url.searchParams.get('sizeMin') ?? undefined;
    const sizeMax = url.searchParams.get('sizeMax') ?? undefined;

    const where: any = {};

    if (search) {
      where.OR = [
        { kode_apar: { contains: search, mode: 'insensitive' } },
        { lokasi: { contains: search, mode: 'insensitive' } },
      ];
    }
    if (lantai) where.lantai = lantai;
    if (jenis) where.jenis = jenis;
    if (sizeMin || sizeMax) {
      where.size = {};
      if (sizeMin) where.size.gte = parseFloat(sizeMin);
      if (sizeMax) where.size.lte = parseFloat(sizeMax);
    }
    const total = await prisma.apar.count({ where });
    const data = await prisma.apar.findMany({
      where,
      orderBy: { updatedAt: 'desc' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    return NextResponse.json({ data, total, page, pageSize });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch apar' },
      { status: 500 }
    );
  }
}
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const session = await getServerSession();
    const userId = session?.user?.id;
    const hasPermission = await auth.api.userHasPermission({
      body: {
        userId: userId,
        permission: {
          apar: ['create'],
        },
      },
    });

    if (hasPermission.success === false) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }
    // expected fields: kode_apar, lantai, lokasi, jenis, size, userId?
    const created = await prisma.apar.create({ data: body });
    return NextResponse.json(created, { status: 201 });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message ?? 'Create failed' },
      { status: 500 }
    );
  }
}
