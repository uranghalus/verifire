import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { db } from './prisma';
import { admin } from 'better-auth/plugins/admin';
export const auth = betterAuth({
  database: prismaAdapter(db, {
    provider: 'mysql',
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },
  user: {
    additionalFields: {
      role: {
        type: 'string',
        input: false,
      },
    },
  },
  plugins: [admin({ adminRoles: ['ADMIN', 'SUPERADMIN'] })],
});
export type Session = typeof auth.$Infer.Session;
export type User = typeof auth.$Infer.Session.user;
