'use client';

import { useQuery } from '@tanstack/react-query';

import { queryKeys } from '@/lib/query-keys';
import { categoriesService } from '@/services/categories.service';

export function useCategories() {
  return useQuery({
    queryKey: queryKeys.categories,
    queryFn: categoriesService.list,
    staleTime: 5 * 60_000,
  });
}
