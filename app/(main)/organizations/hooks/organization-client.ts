// hooks/organization-client.ts
import useSWR from 'swr';
import { toast } from 'sonner';

import { fetcher } from '@/lib/utils';
import {
  CreateOrganizationInput,
  UpdateOrganizationInput,
} from '../data/schema';

// Hook untuk fetch data organizations
export function useOrganizations(
  page: number = 1,
  limit: number = 10,
  search: string = ''
) {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    search: search || '',
  });

  const key = `/api/organizations?${params.toString()}`;

  const { data, error, isLoading, mutate } = useSWR(key, fetcher, {
    revalidateOnFocus: false,
    keepPreviousData: true,
  });

  return {
    data: data?.data || [],
    total: data?.total || 0,
    page: data?.page || page,
    limit: data?.limit || limit,
    error,
    isLoading,
    mutate,
  };
}

// CREATE function dengan toast.promise
export async function createOrganization(payload: CreateOrganizationInput) {
  return toast.promise(
    fetch('/api/organizations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }).then(async (res) => {
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to create organization');
      }
      return res.json();
    }),
    {
      loading: 'Membuat organisasi...',
      success: `Organisasi "${payload.name}" berhasil dibuat`,
      error: (err) => err.message || 'Gagal membuat organisasi',
    }
  );
}

// UPDATE function dengan toast.promise
export async function updateOrganization(
  id: string,
  payload: UpdateOrganizationInput
) {
  return toast.promise(
    fetch(`/api/organizations/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }).then(async (res) => {
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to update organization');
      }
      return res.json();
    }),
    {
      loading: 'Memperbarui organisasi...',
      success: `Organisasi berhasil diperbarui`,
      error: (err) => err.message || 'Gagal memperbarui organisasi',
    }
  );
}

// DELETE function dengan toast.promise
export async function deleteOrganization(id: string, organizationName: string) {
  return toast.promise(
    fetch(`/api/organizations/${id}`, {
      method: 'DELETE',
    }).then(async (res) => {
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to delete organization');
      }
      return res.json();
    }),
    {
      loading: 'Menghapus organisasi...',
      success: `Organisasi "${organizationName}" berhasil dihapus`,
      error: (err) => err.message || 'Gagal menghapus organisasi',
    }
  );
}

// Bulk DELETE function dengan toast.promise
export async function bulkDeleteOrganizations(ids: string[], count: number) {
  return toast.promise(
    Promise.allSettled(
      ids.map((id) =>
        fetch(`/api/organizations/${id}`, { method: 'DELETE' }).then(
          async (res) => {
            if (!res.ok) {
              const error = await res.json();
              throw new Error(error.error || 'Failed to delete organization');
            }
            return res.json();
          }
        )
      )
    ).then((results) => {
      const successCount = results.filter(
        (r) => r.status === 'fulfilled'
      ).length;
      const failedCount = results.filter((r) => r.status === 'rejected').length;

      if (failedCount > 0) {
        throw new Error(
          `Gagal menghapus ${failedCount} data dari ${count} organisasi`
        );
      }

      return { successCount, failedCount };
    }),
    {
      loading: `Menghapus ${count} organisasi...`,
      success: (data) => `Berhasil menghapus ${data.successCount} organisasi`,
      error: (err) => err.message || 'Gagal menghapus organisasi',
    }
  );
}
