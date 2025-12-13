import { fetcher } from '@/lib/utils';
import useSWR from 'swr';

export function useOrganizations(page = 1, limit = 10, search = '') {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    search,
  });

  const key = `/api/organizations?${params.toString()}`;

  const { data, mutate, isLoading } = useSWR(key, fetcher);

  return {
    organizations: data?.data ?? [],
    meta: data?.meta,
    isLoading,
    mutate,
  };
}
