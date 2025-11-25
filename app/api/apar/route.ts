/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { JenisApar } from '@/generated/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const jenis = searchParams.get('jenis')?.split(',') || [];
    const size = searchParams.get('size')?.split(',') || [];

    const skip = (page - 1) * limit;

    // Build where condition step by step
    const where: any = {};

    // Search condition
    if (search) {
      where.OR = [
        { kode_apar: { contains: search, mode: 'insensitive' } },
        { lokasi: { contains: search, mode: 'insensitive' } },
        { lantai: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Jenis filter - handle separately
    if (jenis.length > 0) {
      const validJenis = jenis.filter((j) =>
        Object.values(JenisApar).includes(j as JenisApar)
      ) as JenisApar[];
      if (validJenis.length > 0) {
        where.jenis = { in: validJenis };
      }
    }

    // Size filter - handle separately
    if (size.length > 0) {
      const validSizes = size
        .map((s) => parseFloat(s))
        .filter((s) => !isNaN(s));
      if (validSizes.length > 0) {
        where.size = { in: validSizes };
      }
    }

    const [apar, total] = await Promise.all([
      prisma.apar.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.apar.count({ where }),
    ]);

    return NextResponse.json({
      data: apar,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching APAR:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
