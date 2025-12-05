import { prismaAdapter } from 'better-auth/adapters/prisma';
import { admin as adminPg, organization, username } from 'better-auth/plugins';
import prisma from './prisma';
import { ac, admin, inspector, manager, superadmin } from './permissions';
import { nextCookies } from 'better-auth/next-js';
import { betterAuth } from 'better-auth';
export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'mysql',
  }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
  },
  user: {
    changeEmail: {
      enabled: true,
      updateEmailWithoutVerification: true,
    },
    additionalFields: {
      role: {
        type: 'string',
        input: false,
      },
      username: {
        type: 'string',
        input: true,
      },
    },
  },
  trustedOrigins: ['http://192.168.91.37:3000'],
  plugins: [
    organization(),
    nextCookies(),
    username(),
    adminPg({
      // adminRoles: ['admin', 'superadmin'],
      ac,
      roles: {
        admin,
        superadmin,
        inspector,
        manager,
      },
    }),
  ],
});
export type Session = typeof auth.$Infer.Session;
export type BaseUser = typeof auth.$Infer.Session.user;
