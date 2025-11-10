'use server';

import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { User } from './userSchema';
import { ActionResult } from '@/lib/utils';
import { APIError } from 'better-auth';

export async function fetchUsersServer({
  page,
  pageSize,
  search,
  sortBy,
  sortDirection,
  role,
  status,
}: {
  page: number;
  pageSize: number;
  search: string;
  sortBy: string;
  sortDirection: 'asc' | 'desc';
  role?: string;
  status?: string;
}) {
  const offset = page * pageSize;

  let result;

  try {
    result = await auth.api.listUsers({
      query: {
        searchValue: search || undefined,
        searchField: 'name',
        searchOperator: 'contains',
        filterField: role ? 'role' : status ? 'status' : undefined,
        filterValue: role ?? status ?? undefined,
        filterOperator: 'eq',
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
