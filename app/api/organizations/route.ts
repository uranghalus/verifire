/* eslint-disable @typescript-eslint/no-explicit-any */
import { createOrganizationSchema } from '@/app/(main)/organizations/data/schema';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const page = Number(searchParams.get('page') || 1);
  const limit = Number(searchParams.get('limit') || 10);
  const search = searchParams.get('search') || '';

  const all = await auth.api.listOrganizations({
    headers: await headers(),
  });
  let filtered = all.filter((o: any) =>
    o.name.toLowerCase().includes(search.toLowerCase())
  );

  const start = (page - 1) * limit;
  const paginated = filtered.slice(start, start + limit);

  return NextResponse.json({ data: paginated, total: filtered.length });
}

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = createOrganizationSchema.safeParse(body);
  if (!parsed.success)
    return NextResponse.json({ error: parsed.error }, { status: 400 });

  const org = await auth.api.createOrganization({
    body: {
      name: parsed.data.name,
      slug: parsed.data.slug,
    },
    headers: await headers(),
  });
  return NextResponse.json(org);
}
