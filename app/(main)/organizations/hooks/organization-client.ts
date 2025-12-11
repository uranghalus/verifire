import useSWR from 'swr';
import {
  CreateOrganizationInput,
  UpdateOrganizationInput,
} from '../data/schema';
import { fetcher } from '@/lib/utils';

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

export function useOrganization(id: string) {
  const { data, error, isLoading, mutate } = useSWR(
    id ? `/api/organizations/${id}` : null,
    fetcher,
    {
      revalidateOnFocus: false,
    }
  );

  return {
    data: data,
    error,
    isLoading,
    mutate,
  };
}

export async function createOrganization(payload: CreateOrganizationInput) {
  const res = await fetch('/api/organizations', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Failed to create organization');
  }
  return res.json();
}

export async function updateOrganization(
  id: string,
  payload: UpdateOrganizationInput
) {
  const res = await fetch(`/api/organizations/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Failed to update organization');
  }
  return res.json();
}

export async function deleteOrganization(id: string) {
  const res = await fetch(`/api/organizations/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Failed to delete organization');
  }
  return res.json();
}

export async function bulkDeleteOrganizations(ids: string[]) {
  const results = await Promise.allSettled(
    ids.map((id) => deleteOrganization(id))
  );
  return results;
}
