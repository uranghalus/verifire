// app/api/apar/filter-options/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { JenisApar } from '@/generated/prisma';

export async function GET(request: NextRequest) {
  try {
    // Ambil unique values dari database
    const [jenisList, sizeList, lantaiList, totalApar] = await Promise.all([
      // Jenis APAR
      Object.values(JenisApar),

      // Size APAR (dalam kg)
      prisma.apar
        .findMany({
          select: { size: true },
          distinct: ['size'],
          orderBy: { size: 'asc' },
        })
        .then((results) => results.map((item) => item.size.toString())),

      // Lantai
      prisma.apar
        .findMany({
          where: { lantai: { not: null } },
          select: { lantai: true },
          distinct: ['lantai'],
          orderBy: { lantai: 'asc' },
        })
        .then((results) => results.map((item) => item.lantai!).filter(Boolean)),

      // Total APAR untuk menghitung batch
      prisma.apar.count(),
    ]);

    // Hitung total batch (misal: 50 APAR per batch)
    const APAR_PER_BATCH = 50;
    const totalBatch = Math.ceil(totalApar / APAR_PER_BATCH);

    return NextResponse.json({
      jenis: jenisList,
      size: sizeList,
      lantai: lantaiList,
      totalBatch,
    });
  } catch (error) {
    console.error('Error fetching filter options:', error);
    return NextResponse.json(
      { error: 'Failed to fetch filter options' },
      { status: 500 }
    );
  }
}
