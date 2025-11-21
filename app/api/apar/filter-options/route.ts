import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  // Returns unique values for lantai, jenis, size and totalBatch calculation for QR printing
  const [lantaiRows, jenisRows, sizeRows, count] = await Promise.all([
    prisma.apar.findMany({ select: { lantai: true }, distinct: ['lantai'] }),
    prisma.apar.findMany({ select: { jenis: true }, distinct: ['jenis'] }),
    prisma.apar.findMany({ select: { size: true }, distinct: ['size'] }),
    prisma.apar.count(),
  ]);

  const lantai = lantaiRows.map((r) => r.lantai).filter(Boolean) as string[];
  const jenis = jenisRows.map((r) => r.jenis) as string[];
  const size = sizeRows.map((r) => String(r.size)) as string[];

  const perBatch = 50; // example
  const totalBatch = Math.max(1, Math.ceil(count / perBatch));

  return NextResponse.json({ lantai, jenis, size, totalBatch });
}
