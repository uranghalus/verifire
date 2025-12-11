/* eslint-disable @typescript-eslint/no-explicit-any */
import { auth } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';

import { headers } from 'next/headers';
import { updateOrganizationSchema } from '@/app/(main)/organizations/data/schema';
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const parsed = updateOrganizationSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error?.message || 'Invalid input' },
        { status: 400 }
      );
    }

    const organizationId = params.id;

    // Check if slug already exists for other organizations
    if (parsed.data.slug) {
      const allOrgs = await auth.api.listOrganizations({
        headers: await headers(),
      });

      const slugExists = allOrgs.some(
        (org: any) => org.slug === parsed.data.slug && org.id !== organizationId
      );

      if (slugExists) {
        return NextResponse.json(
          { error: 'Slug already exists' },
          { status: 409 }
        );
      }
    }

    const org = await auth.api.updateOrganization({
      body: {
        data: {
          name: parsed.data.name,
          slug: parsed.data.slug,
          logo: parsed.data.logo as string,
          metadata: parsed.data.metadata,
        },
        organizationId,
      },
      headers: await headers(),
    });

    return NextResponse.json(org);
  } catch (error) {
    console.error('Error updating organization:', error);
    return NextResponse.json(
      { error: 'Failed to update organization' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const organizationId = id;

    await auth.api.deleteOrganization({
      body: {
        organizationId,
      },
      headers: await headers(),
    });

    return NextResponse.json({
      success: true,
      message: 'Organization deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting organization:', error);
    return NextResponse.json(
      { error: 'Failed to delete organization' },
      { status: 500 }
    );
  }
}
