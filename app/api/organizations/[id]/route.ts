/* eslint-disable @typescript-eslint/no-explicit-any */
import { auth } from '@/lib/auth';
import { NextResponse } from 'next/server';

import { headers } from 'next/headers';
import { updateOrganizationSchema } from '@/app/(main)/organizations/data/schema';

export async function GET(req: Request, { params }: any) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const org = await auth.api.getFullOrganization({
    query: {
      organizationId: params.id,
    },
    headers: await headers(),
  });
  return NextResponse.json(org);
}

export async function PATCH(req: Request, { params }: any) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const parsed = updateOrganizationSchema.safeParse(body);
  if (!parsed.success)
    return NextResponse.json(
      { error: parsed.error.flatten() },
      { status: 422 }
    );

  const updated = await auth.api.updateOrganization({
    body: {
      data: { name: parsed.data.name, slug: parsed.data.slug },
      organizationId: params.id,
    },
    headers: await headers(),
  });

  return NextResponse.json(updated);
}

export async function DELETE(req: Request, { params }: any) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await auth.api.deleteOrganization({
    body: {
      organizationId: params.id,
    },
    headers: await headers(),
  });
  return NextResponse.json({ success: true });
}
