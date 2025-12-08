/* eslint-disable @typescript-eslint/no-explicit-any */
import { createOrganizationSchema } from '@/app/(main)/organizations/data/schema';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const url = new URL(req.url);
  const page = Number(url.searchParams.get('page') || '1');
  const limit = Number(url.searchParams.get('limit') || '10');
  const search = url.searchParams.get('search') || '';
  const sort = url.searchParams.get('sort') || 'createdAt:desc'; // placeholder

  // fetch all organizations (change to paginated call if backend supports it)
  const all = await auth.api.listOrganizations({
    headers: await headers(),
  }); // assume returns array
  let orgs = Array.isArray(all) ? all : all ?? [];

  // optional search
  if (search) {
    const q = search.toLowerCase();
    orgs = orgs.filter(
      (o: any) =>
        (o.name || '').toLowerCase().includes(q) ||
        (o.slug || '').toLowerCase().includes(q)
    );
  }

  // simple sort (only createdAt or name)
  if (sort) {
    const [key, dir] = sort.split(':');
    orgs.sort((a: any, b: any) => {
      if (!a[key] || !b[key]) return 0;
      if (a[key] < b[key]) return dir === 'desc' ? 1 : -1;
      if (a[key] > b[key]) return dir === 'desc' ? -1 : 1;
      return 0;
    });
  }

  const total = orgs.length;
  const start = (page - 1) * limit;
  const paged = orgs.slice(start, start + limit);

  return NextResponse.json({ data: paged, meta: { total, page, limit } });
}

export async function POST(req: Request) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session)
    // console.log(session);
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const parsed = createOrganizationSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten() },
      { status: 422 }
    );
  }

  const org = await auth.api.createOrganization({
    body: {
      name: parsed.data.name,
      slug: parsed.data.slug,
    },
    headers: await headers(),
  });
  return NextResponse.json(org);
}
