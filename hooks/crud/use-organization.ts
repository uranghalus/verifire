'use server';

import { auth } from '@/lib/auth';
import { getServerSession } from '@/lib/get-session';
import { headers } from 'next/headers';

type Params = {
  page?: number;
  limit?: number;
  name?: string;
};

export async function getOrganization({
  page = 1,
  limit = 10,
  name = '',
}: Params) {
  const session = await getServerSession();
  if (!session?.user) {
    throw new Error('Unauthorized');
  }
  const organizations = await auth.api.listOrganizations({
    headers: await headers(),
  });
  // 2️⃣ Search (manual)
  const filtered = name
    ? organizations.filter((org) =>
        org.name.toLowerCase().includes(name.toLowerCase())
      )
    : organizations;
  // 3️⃣ Pagination (manual)
  const total = filtered.length;
  const start = (page - 1) * limit;
  const end = start + limit;
  const paginated = filtered.slice(start, end);
  return {
    data: paginated,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}
