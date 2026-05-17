'use client';

import { useQuery } from '@tanstack/react-query';

import { queryKeys } from '@/lib/query-keys';
import { providersService } from '@/services/providers.service';

export function useProvider(id: string) {
  return useQuery({
    queryKey: queryKeys.providers.detail(id),
    queryFn: () => providersService.getProfile(id),
    enabled: Boolean(id),
  });
}
