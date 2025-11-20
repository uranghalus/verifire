import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

export interface UserWithDetails {
  id: string;
  name: string;
  username?: string | null;
  email: string;
  verified: boolean;
  banned: boolean;
  banReason?: string;
  banExpires?: Date | null;
  accounts: string[];
  lastSignIn: Date | null;
  createdAt: Date;
  avatarUrl: string;
  role?: string;
}

export interface GetUsersOptions {
  limit?: number;
  offset?: number;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  role?: string;
  status?: string;
  email?: string;
  name?: string;
}

export async function getUsers(
  options: GetUsersOptions = {}
): Promise<{ users: UserWithDetails[]; total: number }> {
  const query: Record<string, unknown> = {
    limit: options.limit ?? 10,
    offset: options.offset ?? 0,
  };

  if (options.sortBy) query.sortBy = options.sortBy;
  if (options.sortDirection) query.sortDirection = options.sortDirection;

  if (options.role) {
    query.filterField = 'role';
    query.filterOperator = 'eq';
    query.filterValue = options.role;
  }

  if (options.status) {
    query.filterField = 'banned';
    query.filterOperator = 'eq';
    query.filterValue = options.status === 'banned';
  }

  if (options.email) {
    query.searchField = 'email';
    query.searchOperator = 'contains';
    query.searchValue = options.email;
  }

  if (options.name) {
    query.searchField = 'name';
    query.searchOperator = 'contains';
    query.searchValue = options.name;
  }

  // ✅ Ambil user dari Better Auth
  const result = await auth.api.listUsers({
    headers: await headers(),
    query,
  });

  if (!result.users) {
    return { users: [], total: 0 };
  }

  // ✅ Ambil accounts (Prisma)
  const accountsQuery = await prisma.account.findMany({
    select: {
      userId: true,
      providerId: true,
    },
  });

  // ✅ Ambil sessions (Prisma)
  const sessionsQuery = await prisma.session.findMany({
    select: {
      userId: true,
      createdAt: true,
    },
    orderBy: { createdAt: 'asc' },
  });

  // ✅ Kelompokkan accounts per user
  const accountsByUser = accountsQuery.reduce((acc, account) => {
    if (!acc[account.userId]) acc[account.userId] = [];
    acc[account.userId].push(account.providerId);
    return acc;
  }, {} as Record<string, string[]>);

  // ✅ Ambil lastSignIn per user
  const lastSignInByUser = sessionsQuery.reduce((acc, session) => {
    if (!acc[session.userId] || session.createdAt > acc[session.userId]) {
      acc[session.userId] = session.createdAt;
    }
    return acc;
  }, {} as Record<string, Date>);

  // ✅ Transform data agar cocok dengan UI
  const users: UserWithDetails[] = result.users.map((user) => {
    const accounts = accountsByUser[user.id] || [];
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      username: user.username,
      verified: user.emailVerified,
      role: user.role,
      banned: user.banned ?? false,
      banReason: user.banReason || '',
      banExpires: user.banExpires || null,
      accounts,
      lastSignIn: lastSignInByUser[user.id] || null,
      createdAt: user.createdAt,
      avatarUrl: user.image || '',
    };
  });

  return { users, total: result.total ?? users.length };
}
