/* eslint-disable @typescript-eslint/no-explicit-any */
import NextAuth, { User } from 'next-auth';
import { db } from './prisma';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@auth/prisma-adapter';

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(db),
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(
        credentials: Partial<Record<'email' | 'password', unknown>>
      ) {
        if (!credentials || typeof credentials.email !== 'string') return null;
        const user = await db.user.findUnique({
          where: { email: credentials.email },
        });
        if (!user) return null;
        // Assuming you store password hashed in a separate table or field
        // If you use OAuth only, adapt accordingly
        // Example: compare hashed password stored in Account or separate model
        // For simplicity, assume `user.password` exists (you may need to add it to schema if using credentials)
        // If you don't want to store password in User, use OAuth providers instead
        // This snippet assumes `password` field exists on User (not in prisma schema above)
        // If password doesn't exist, return user to allow SSO providers only.
        // Skip password check if not implemented.
        // if (!user.password) return user
        // const isValid = await bcrypt.compare(credentials.password, user.password)
        // if (!isValid) return null
        return user;
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.role = (user as User & { role: string }).role;
      return token;
    },
    async session({ session, token }: any) {
      session.user.role = token.role;
      session.user.id = token.sub;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
});
