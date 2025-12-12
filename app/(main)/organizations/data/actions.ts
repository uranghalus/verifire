/* eslint-disable @typescript-eslint/no-explicit-any */
'use server';

import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

export async function listOrganizations() {
  return auth.api.listOrganizations({
    headers: await headers(),
  });
}

export async function createOrganization(body: {
  name: string;
  slug: string;
  logo?: string | null;
  metadata?: any;
}) {
  return auth.api.createOrganization({
    body: {
      name: body.name,
      slug: body.slug,
    },
    headers: await headers(),
  });
}

export async function updateOrganization(id: string, body: any) {
  return auth.api.updateOrganization({
    body: {
      organizationId: id,
      data: {
        name: body.name,
        slug: body.slug,
      },
    },
    headers: await headers(),
  });
}

export async function deleteOrganization(id: string) {
  return auth.api.deleteOrganization({
    body: {
      organizationId: id,
    },
    headers: await headers(),
  });
}
