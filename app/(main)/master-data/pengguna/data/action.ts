'use server';

import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

export async function fetchUsersServer({
  page,
  pageSize,
  search,
  sortBy,
  sortDirection,
}: {
  page: number;
  pageSize: number;
  search: string;
  sortBy: string;
  sortDirection: 'asc' | 'desc';
}) {
  const offset = page * pageSize;

  let result;

  try {
    result = await auth.api.listUsers({
      query: {
        searchValue: search || undefined,
        searchField: 'name',
        searchOperator: 'contains',
        limit: pageSize,
        offset,
        sortBy,
        sortDirection,
      },
      headers: await headers(), // ✅ inject session cookies
    });
  } catch (err) {
    console.error('listUsers error:', err);
    return { users: [], total: 0 };
  }

  // ✅ result shape:
  // { data: { users: [], total: number }, error }
  //   if (!result || result.error) {
  //     console.error('listUsers response error:', result?.error);
  //     return { users: [], total: 0 };
  //   }

  const data = result;
  console.log(data);

  return {
    users: data?.users ?? [],
    total: data?.total ?? 0,
  };
}
