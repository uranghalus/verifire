/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/apar/route.ts
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

    // Build where condition
    const whereConditions: any[] = [];

    if (search) {
      whereConditions.push({
        OR: [
          { kode_apar: { contains: search, mode: 'insensitive' as const } },
          { lokasi: { contains: search, mode: 'insensitive' as const } },
          { lantai: { contains: search, mode: 'insensitive' as const } },
        ],
      });
    }

    if (jenis.length > 0) {
      const jenisEnum = jenis.filter((j) =>
        Object.values(JenisApar).includes(j as JenisApar)
      ) as JenisApar[];
      if (jenisEnum.length > 0) {
        whereConditions.push({
          jenis: { in: jenisEnum },
        });
      }
    }

    if (size.length > 0) {
      const sizeNumbers = size
        .map((s) => parseFloat(s))
        .filter((s) => !isNaN(s));
      if (sizeNumbers.length > 0) {
        whereConditions.push({
          size: { in: sizeNumbers },
        });
      }
    }

    const where = whereConditions.length > 0 ? { AND: whereConditions } : {};

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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validasi
    if (!Object.values(JenisApar).includes(body.jenis)) {
      return NextResponse.json(
        { error: 'Jenis APAR tidak valid' },
        { status: 400 }
      );
    }

    const apar = await prisma.apar.create({
      data: {
        kode_apar: body.kode_apar,
        lantai: body.lantai || null,
        lokasi: body.lokasi,
        jenis: body.jenis as JenisApar,
        size: parseFloat(body.size),
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
    console.error('Error creating APAR:', error);
    return NextResponse.json(
      { error: 'Failed to create APAR' },
      { status: 500 }
    );
  }
}
