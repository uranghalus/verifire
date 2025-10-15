import { PrismaClient } from '@prisma/client';

declare global {
  // allow global prisma in dev to avoid hot reload duplicates

  var prisma: PrismaClient | undefined;
}

export const prisma = global.prisma ?? new PrismaClient();
if (process.env.NODE_ENV !== 'production') global.prisma = prisma;
