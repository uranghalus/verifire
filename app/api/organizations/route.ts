/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  createOrganizationSchema,
  updateOrganizationSchema,
} from '@/app/(main)/organizations/data/schema';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const page = Number(searchParams.get('page') || 1);
    const limit = Number(searchParams.get('limit') || 10);
    const search = searchParams.get('search') || '';

    const all = await auth.api.listOrganizations({
      headers: await headers(),
    });

    let filtered = all;
    if (search) {
      filtered = all.filter(
        (o: any) =>
          o.name.toLowerCase().includes(search.toLowerCase()) ||
          o.slug.toLowerCase().includes(search.toLowerCase())
      );
    }

    const start = (page - 1) * limit;
    const paginated = filtered.slice(start, start + limit);

    return NextResponse.json({
      data: paginated,
      total: filtered.length,
      page,
      limit,
      totalPages: Math.ceil(filtered.length / limit),
    });
  } catch (error) {
    console.error('Error fetching organizations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch organizations' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = createOrganizationSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error || 'Invalid input' },
        { status: 400 }
      );
    }

    // Check if slug already exists
    const allOrgs = await auth.api.listOrganizations({
      headers: await headers(),
    });

    const slugExists = allOrgs.some(
      (org: any) => org.slug === parsed.data.slug
    );

    if (slugExists) {
      return NextResponse.json(
        { error: 'Slug already exists' },
        { status: 409 }
      );
    }
    console.log('Parsed Data', parsed);

    const org = await auth.api.createOrganization({
      body: {
        name: parsed.data.name,
        slug: parsed.data.slug,
      },
      headers: await headers(),
    });

    return NextResponse.json(org, { status: 201 });
  } catch (error) {
    console.error('Error creating organization:', error);
    return NextResponse.json(
      { error: 'Failed to create organization' },
      { status: 500 }
    );
  }
}
