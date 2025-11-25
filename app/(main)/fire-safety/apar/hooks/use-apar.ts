// hooks/use-apar-data.ts
import { useState, useEffect } from 'react';
import { Apar } from '../types/apar';

interface UseAparDataProps {
  page?: number;
  pageSize?: number;
  search?: string;
  jenis?: string;
}

interface AparResponse {
  data: Apar[];
  pagination: {
    page: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
  };
}

export function useAparData({
  page = 1,
  pageSize = 10,
  search = '',
  jenis = '',
}: UseAparDataProps = {}) {
  const [data, setData] = useState<Apar[]>([]);
  const [pagination, setPagination] = useState({
    page,
    pageSize,
    totalCount: 0,
    totalPages: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        const params = new URLSearchParams({
          page: page.toString(),
          pageSize: pageSize.toString(),
          ...(search && { search }),
          ...(jenis && { jenis }),
        });

        const response = await fetch(`/api/apar?${params}`);

        if (!response.ok) {
          throw new Error('Failed to fetch APAR data');
        }

        const result: AparResponse = await response.json();
        setData(result.data);
        setPagination(result.pagination);
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [page, pageSize, search, jenis]);

  return {
    data,
    pagination,
    isLoading,
    error,
    refetch: () => {
      // Trigger refetch dengan current params
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        pageSize: pagination.pageSize.toString(),
        ...(search && { search }),
        ...(jenis && { jenis }),
      });
      return fetch(`/api/apar?${params}`);
    },
  };
}
