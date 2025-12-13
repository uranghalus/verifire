import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const page = Number(searchParams.get('page') ?? 1);
  const limit = Number(searchParams.get('limit') ?? 10);
  const search = searchParams.get('search') ?? '';

  const data = await auth.api.listOrganizations({
    headers: await headers(),
  });

  // filtering client-like
  let organizations = data;

  if (search) {
    organizations = organizations.filter((org) =>
      org.name.toLowerCase().includes(search.toLowerCase())
    );
  }

  const total = organizations.length;
  const start = (page - 1) * limit;
  const end = start + limit;

  return NextResponse.json({
    data: organizations.slice(start, end),
    meta: {
      page,
      limit,
      total,
    },
  });
}
export async function POST(req: Request) {
  const body = await req.json();

  const org = await auth.api.createOrganization({
    body: {
      name: body.name,
      slug: body.slug,
    },
    headers: await headers(),
  });

  return NextResponse.json(org);
}
