/* eslint-disable @typescript-eslint/no-explicit-any */
import { auth } from '@/lib/auth';
import { NextResponse } from 'next/server';

import { headers } from 'next/headers';
import { updateOrganizationSchema } from '@/app/(main)/organizations/data/schema';

export async function PUT(req: Request, { params }: any) {
  const body = await req.json();
  const parsed = updateOrganizationSchema.safeParse(body);
  if (!parsed.success)
    return NextResponse.json({ error: parsed.error }, { status: 400 });

  const org = await auth.api.updateOrganization({
    body: {
      data: {
        name: parsed.data.name,
        slug: parsed.data.slug,
      },
      organizationId: params.id,
    },
    headers: await headers(),
  });
  return NextResponse.json(org);
}

export async function DELETE(_: Request, { params }: any) {
  await auth.api.deleteOrganization({
    body: {
      organizationId: params.id,
    },
    headers: await headers(),
  });
  return NextResponse.json({ success: true });
}
