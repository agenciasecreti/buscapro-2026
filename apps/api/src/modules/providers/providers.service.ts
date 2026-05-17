import type { ProviderProfile } from '@buscapro/types';

import { HttpError } from '../../utils/http-error';
import { reviewsRepository } from '../reviews/reviews.repository';
import { mapService } from '../services/services.mapper';

import { providersRepository } from './providers.repository';

export const providersService = {
  async getProfile(id: string): Promise<ProviderProfile> {
    const provider = await providersRepository.findProvider(id);
    if (!provider) {
      throw new HttpError(
        404,
        'PROVIDER_NOT_FOUND',
        'Prestador não encontrado.',
      );
    }

    const [serviceRows, reviewRows, rating] = await Promise.all([
      providersRepository.listProviderServices(id),
      providersRepository.listProviderReviews(id),
      reviewsRepository.ratingForProvider(id),
    ]);

    const ratings = await reviewsRepository.ratingsByServiceIds(
      serviceRows.map((s) => s.id),
    );

    return {
      id: provider.id,
      name: provider.name,
      avatarUrl: provider.avatarUrl,
      phone: provider.phone,
      role: provider.role,
      createdAt: provider.createdAt.toISOString(),
      location: provider.location
        ? { city: provider.location.city, state: provider.location.state }
        : null,
      rating,
      services: serviceRows.map((row) =>
        mapService(row, ratings.get(row.id) ?? { average: 0, count: 0 }),
      ),
      reviews: reviewRows.map((r) => ({
        id: r.id,
        rating: r.rating,
        comment: r.comment,
        createdAt: r.createdAt.toISOString(),
        reviewer: {
          id: r.reviewer.id,
          name: r.reviewer.name,
          avatarUrl: r.reviewer.avatarUrl,
        },
      })),
    };
  },
};
