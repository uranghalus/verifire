/* eslint-disable @typescript-eslint/no-explicit-any */
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

// GET single organization
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const h = await headers();
  const session = await auth.api.getSession({ headers: h });
  if (!session?.user)
    return NextResponse.json(
      { error: 'Unauthorized' },
      {
        status: 401,
      }
    );
  const orgs = await auth.api.getFullOrganization({
    query: {
      organizationId: id,
      membersLimit: 100,
    },
    headers: h,
  });

  return orgs
    ? NextResponse.json(orgs)
    : NextResponse.json({ error: 'Not found' }, { status: 404 });
}
// PATCH — update organization via Better Auth API
export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const h = await headers();
  const session = await auth.api.getSession({ headers: h });
  if (!session?.user)
    return NextResponse.json(
      { error: 'Unauthorized' },
      {
        status: 401,
      }
    );
  const body = await request.json();
  try {
    const updated = await auth.api.updateOrganization({
      body,
      params: { organizationId: id },
      headers: h,
    });
    return NextResponse.json(updated);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
// DELETE — Better Auth delete org
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const h = await headers();
  const session = await auth.api.getSession({ headers: h });
  if (!session?.user)
    return NextResponse.json(
      { error: 'Unauthorized' },
      {
        status: 401,
      }
    );
  try {
    await auth.api.deleteOrganization({
      body: { organizationId: id },
      headers: h,
    });
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
