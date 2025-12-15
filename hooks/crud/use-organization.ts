import { fetcher } from '@/lib/utils';
import { useEffect, useState } from 'react';
import useSWR from 'swr';
export function useDebounce<T>(value: T, delay = 500) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}
export function useOrganizations(page = 1, limit = 10, search = '') {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    search,
  });

  const key = `/api/organizations?${params.toString()}`;

  const { data, mutate, isLoading } = useSWR(key, fetcher, {
    keepPreviousData: true,
  });

  return {
    organizations: data?.data ?? [],
    meta: data?.meta,
    isLoading,
    mutate,
  };
}
