// app/apar/hooks/useApar.ts
import useSWR from 'swr';
import { Apar, AparFormData } from '../types/apar';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface UseAparProps {
  page?: number;
  limit?: number;
  search?: string;
  lantai?: string;
  jenis?: string;
  size?: string;
}

export function useApar(params: UseAparProps = {}) {
  const { page = 1, limit = 10, search, lantai, jenis, size } = params;

  const searchParams = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    ...(search && { search }),
    ...(lantai && { lantai }),
    ...(jenis && { jenis }),
    ...(size && { size }),
  });

  const { data, error, isLoading, mutate } = useSWR(
    `/api/apar?${searchParams}`,
    fetcher,
    {
      keepPreviousData: true,
      revalidateOnFocus: false,
    }
  );

  return {
    data: data?.data,
    pagination: data?.pagination,
    isLoading,
    isError: error,
    mutate,
  };
}

export function useAparById(id: number) {
  const { data, error, isLoading, mutate } = useSWR(
    id ? `/api/apar/${id}` : null,
    fetcher
  );

  return {
    data: data?.data,
    isLoading,
    isError: error,
    mutate,
  };
}

export async function createAparMutation(data: AparFormData) {
  const response = await fetch('/api/apar', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to create APAR');
  }

  return response.json();
}

export async function updateAparMutation(
  id: number,
  data: Partial<AparFormData>
) {
  const response = await fetch(`/api/apar/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to update APAR');
  }

  return response.json();
}

export async function deleteAparMutation(id: number) {
  const response = await fetch(`/api/apar/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to delete APAR');
  }

  return response.json();
}
