/* eslint-disable @typescript-eslint/no-explicit-any */
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';

// GET — menggunakan Better Auth built‑in API
export async function GET() {
  const h = await headers();
  const session = await auth.api.getSession({ headers: h });
  if (!session?.user)
    return NextResponse.json(
      { error: 'Unauthorized' },
      {
        status: 401,
      }
    );
  const orgs = await auth.api.listOrganizations({ headers: h });
  return NextResponse.json(orgs);
}
// POST — create organization resmi Better Auth
export async function POST(req: Request) {
  const h = await headers();
  const session = await auth.api.getSession({ headers: h });
  if (!session?.user)
    return NextResponse.json(
      { error: 'Unauthorized' },
      {
        status: 401,
      }
    );
  const body = await req.json();
  try {
    const org = await auth.api.createOrganization({
      body: {
        name: body.name,
        slug: body.slug,
        logo: body.logo || null,
        metadata: body.metadata || {},
        keepCurrentActiveOrganization: false,
      },
      headers: h,
    });
    return NextResponse.json(org);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
