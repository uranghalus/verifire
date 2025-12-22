/* eslint-disable @typescript-eslint/no-explicit-any */
'use server';

import { organizationSchema } from '@/app/(main)/organizations/data/schema';
import { auth } from '@/lib/auth';
import { getServerSession } from '@/lib/get-session';
import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';
type ActionState =
  | { status: 'success'; message?: string }
  | { status: 'error'; message: string }
  | null;
type Params = {
  id?: string;
  page?: number;
  limit?: number;
  name?: string;
};

export async function getOrganization({
  page = 1,
  limit = 10,
  name = '',
}: Params) {
  const session = await getServerSession();
  if (!session?.user) {
    throw new Error('Unauthorized');
  }
  const organizations = await auth.api.listOrganizations({
    headers: await headers(),
  });
  // 2️⃣ Search (manual)
  const filtered = name
    ? organizations.filter((org) =>
        org.name.toLowerCase().includes(name.toLowerCase())
      )
    : organizations;
  // 3️⃣ Pagination (manual)
  const total = filtered.length;
  const start = (page - 1) * limit;
  const end = start + limit;
  const paginated = filtered.slice(start, end);
  return {
    data: paginated,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}
export async function createOrganization(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const session = await getServerSession();
  if (!session?.user) {
    throw new Error('Unauthorized');
  }

  const parsed = organizationSchema.safeParse({
    id: session.user.id,
    name: formData.get('name'),
    slug: formData.get('slug'),
  });

  if (!parsed.success) {
    return { status: 'error', message: 'Validasi gagal' };
  }

  try {
    await auth.api.createOrganization({
      body: {
        name: parsed.data.name,
        slug: parsed.data.slug,
        userId: parsed.data.id,
      },
      headers: await headers(),
    });

    revalidatePath('/organizations');
    return { status: 'success' };
  } catch (e: any) {
    return {
      status: 'error',
      message: e?.message ?? 'Gagal membuat organization',
    };
  }
}

export async function updateOrganization(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const id = formData.get('id') as string;
  const parsed = organizationSchema.safeParse({
    name: formData.get('name'),
    slug: formData.get('slug'),
  });
  if (!id || !parsed.success) {
    return { status: 'error', message: 'Data tidak valid' };
  }
  try {
    const data = await auth.api.updateOrganization({
      body: {
        data: {
          name: parsed.data.name,
          slug: parsed.data.slug,
        },
        organizationId: id,
      },
      headers: await headers(),
    });
    revalidatePath('/organizations');
    return { status: 'success', message: 'Organization berhasil diupdate' };
  } catch (error: any) {
    return {
      status: 'error',
      message: error?.message ?? 'Gagal mengupdate organization',
    };
  }
}

export async function deleteOrganization({ id }: { id: string }) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return {
        success: false,
        message: 'Unauthorized',
      };
    }

    await auth.api.deleteOrganization({
      body: { organizationId: id },
      headers: await headers(),
    });
    // 🔥 PENTING: revalidate server component
    revalidatePath('/organizations');
    return {
      success: true,
      message: 'Organization berhasil dihapus',
    };
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || 'Gagal menghapus organization',
    };
  }
}
