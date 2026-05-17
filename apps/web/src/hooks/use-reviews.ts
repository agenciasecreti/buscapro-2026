'use client';

import type { CreateReviewPayload } from '@buscapro/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { queryKeys } from '@/lib/query-keys';
import { reviewsService } from '@/services/reviews.service';
import { useAuthStore } from '@/store/auth.store';

export function useServiceReviews(serviceId: string) {
  return useQuery({
    queryKey: queryKeys.services.reviews(serviceId),
    queryFn: () => reviewsService.listByService(serviceId),
    enabled: Boolean(serviceId),
  });
}

export function useCreateReview(serviceId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateReviewPayload) => {
      const token = useAuthStore.getState().token;
      if (!token) throw new Error('Sessão expirada. Entre novamente.');
      return reviewsService.create(token, payload);
    },
    onSuccess: () => {
      void qc.invalidateQueries({
        queryKey: queryKeys.services.reviews(serviceId),
      });
      void qc.invalidateQueries({
        queryKey: queryKeys.services.detail(serviceId),
      });
    },
  });
}
