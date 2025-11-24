/* eslint-disable @typescript-eslint/no-explicit-any */
// lib/data/apar.ts
import prisma from '@/lib/prisma';
import { AparFormData, JenisApar } from '../types/apar';

export async function getApar(params: {
  page: number;
  limit: number;
  search?: string;
  lantai?: string;
  jenis?: string;
  size?: string;
}) {
  const { page, limit, search, lantai, jenis, size } = params;
  const skip = (page - 1) * limit;

  const where: any = {};

  if (search) {
    where.OR = [
      { kode_apar: { contains: search, mode: 'insensitive' } },
      { lokasi: { contains: search, mode: 'insensitive' } },
      { lantai: { contains: search, mode: 'insensitive' } },
    ];
  }

  if (lantai) {
    where.lantai = lantai;
  }

  if (jenis) {
    where.jenis = jenis as JenisApar;
  }

  if (size) {
    where.size = parseFloat(size);
  }

  const [apar, total] = await Promise.all([
    prisma.apar.findMany({
      where,
      skip,
      take: limit,
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.apar.count({ where }),
  ]);

  return {
    data: apar,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
}

export async function getAparById(id: number) {
  return prisma.apar.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  });
}

export async function createApar(data: AparFormData) {
  return prisma.apar.create({
    data: data as any,
    include: {
      user: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  });
}

export async function updateApar(id: number, data: Partial<AparFormData>) {
  return prisma.apar.update({
    where: { id },
    data: data as any,
    include: {
      user: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  });
}

export async function deleteApar(id: number) {
  return prisma.apar.delete({
    where: { id },
  });
}
