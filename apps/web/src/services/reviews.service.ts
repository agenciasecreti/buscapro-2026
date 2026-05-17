import type { CreateReviewPayload, Review } from '@buscapro/types';

import { apiFetch } from './http';

export const reviewsService = {
  listByService(serviceId: string): Promise<Review[]> {
    return apiFetch<Review[]>(`/api/services/${serviceId}/reviews`);
  },

  create(token: string, payload: CreateReviewPayload): Promise<Review> {
    return apiFetch<Review>('/api/reviews', {
      method: 'POST',
      token,
      body: payload,
    });
  },
};
