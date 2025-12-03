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
  const orgs = await auth.api.listOrganizations({ headers: await headers() });
  return NextResponse.json(orgs);
}
// POST — create organization resmi Better Auth
export async function POST(req: Request) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  console.log(JSON.stringify(body, null, 2));
  try {
    const payload: any = {
      name: body.name,
      slug: body.slug.toLowerCase(),
      metadata: body.metadata || {},
      keepCurrentActiveOrganization: false,
    };

    // hanya kirim logo jika ada dan valid
    if (body.logo && typeof body.logo === 'string') {
      payload.logo = body.logo;
    }

    const org = await auth.api.createOrganization({
      body: payload,
      headers: await headers(),
    });

    return NextResponse.json(org);
  } catch (err: any) {
    console.log('BetterAuth error:', err.body ?? err);
    return NextResponse.json(
      { error: err.body?.message || err.message },
      { status: 400 }
    );
  }
}
