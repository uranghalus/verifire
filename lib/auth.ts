import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { PrismaClient } from '@prisma/client';
import { db } from './prisma';
export const auth = betterAuth({
  database: prismaAdapter(db, {
    provider: 'mysql',
  }),
  emailAndPassword: {
    enabled: true,
  },
});
