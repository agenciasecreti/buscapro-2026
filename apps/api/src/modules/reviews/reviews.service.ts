import type { Review } from '@buscapro/types';

import { prisma } from '../../prisma';
import { HttpError } from '../../utils/http-error';

import { reviewsRepository } from './reviews.repository';
import type { CreateReviewInput } from './reviews.schema';

type ReviewWithAuthor = Awaited<
  ReturnType<typeof reviewsRepository.listByService>
>[number];

function mapReview(row: ReviewWithAuthor): Review {
  return {
    id: row.id,
    rating: row.rating,
    comment: row.comment,
    createdAt: row.createdAt.toISOString(),
    reviewer: {
      id: row.reviewer.id,
      name: row.reviewer.name,
      avatarUrl: row.reviewer.avatarUrl,
    },
  };
}

export const reviewsService = {
  async create(
    input: CreateReviewInput,
    reviewerId: string,
  ): Promise<Review> {
    const service = await prisma.service.findUnique({
      where: { id: input.serviceId },
      select: { id: true, userId: true },
    });
    if (!service) {
      throw new HttpError(404, 'SERVICE_NOT_FOUND', 'Serviço não encontrado.');
    }
    if (service.userId === reviewerId) {
      throw new HttpError(
        400,
        'CANNOT_REVIEW_OWN',
        'Você não pode avaliar o próprio serviço.',
      );
    }

    const existing = await reviewsRepository.findByReviewerAndService(
      reviewerId,
      input.serviceId,
    );
    if (existing) {
      throw new HttpError(
        409,
        'ALREADY_REVIEWED',
        'Você já avaliou este serviço.',
      );
    }

    const created = await reviewsRepository.create({
      rating: input.rating,
      comment: input.comment ?? null,
      reviewerId,
      serviceId: input.serviceId,
    });

    const withAuthor = await prisma.review.findUniqueOrThrow({
      where: { id: created.id },
      include: {
        reviewer: { select: { id: true, name: true, avatarUrl: true } },
      },
    });
    return mapReview(withAuthor);
  },

  async listByService(serviceId: string): Promise<Review[]> {
    const rows = await reviewsRepository.listByService(serviceId);
    return rows.map(mapReview);
  },
};
