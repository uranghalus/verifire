import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { admin as adminPg } from 'better-auth/plugins';
import prisma from './prisma';
import { ac, admin, inspector, manager, superadmin } from './permissions';
export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'mysql',
  }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
  },
  user: {
    additionalFields: {
      role: {
        type: 'string',
        input: false,
      },
    },
  },
  trustedOrigins: ['http://192.168.91.37:3000'],
  plugins: [
    adminPg({
      adminRoles: ['admin', 'superadmin'],
    }),
  ],
});
