import useSWR from 'swr';
import {
  CreateOrganizationInput,
  UpdateOrganizationInput,
} from '../data/schema';
import { fetcher } from '@/lib/utils';

export function useOrganizations(page: number, limit: number, search: string) {
  const query = new URLSearchParams({
    page: `${page}`,
    limit: `${limit}`,
    search,
  }).toString();
  const { data, error, isLoading, mutate } = useSWR(
    `/api/organizations?${query}`,
    fetcher
  );
  return { data, error, isLoading, mutate };
}

export async function createOrganization(payload: CreateOrganizationInput) {
  const res = await fetch('/api/organizations', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Failed to create organization');
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
  if (!res.ok) throw new Error('Failed to update organization');
  return res.json();
}

export async function deleteOrganization(id: string) {
  const res = await fetch(`/api/organizations/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete organization');
  return res.json();
}
