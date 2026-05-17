import type { Prisma, Review } from '@prisma/client';

import { prisma } from '../../prisma';

type Rating = { average: number; count: number };

const round1 = (n: number): number => Math.round(n * 10) / 10;

export const reviewsRepository = {
  create(data: Prisma.ReviewUncheckedCreateInput): Promise<Review> {
    return prisma.review.create({ data });
  },

  findByReviewerAndService(
    reviewerId: string,
    serviceId: string,
  ): Promise<Review | null> {
    return prisma.review.findFirst({ where: { reviewerId, serviceId } });
  },

  listByService(serviceId: string) {
    return prisma.review.findMany({
      where: { serviceId },
      orderBy: { createdAt: 'desc' },
      include: {
        reviewer: { select: { id: true, name: true, avatarUrl: true } },
      },
    });
  },

  /** Média + contagem de avaliações por serviço (lote). */
  async ratingsByServiceIds(
    serviceIds: string[],
  ): Promise<Map<string, Rating>> {
    const map = new Map<string, Rating>();
    if (serviceIds.length === 0) return map;

    const grouped = await prisma.review.groupBy({
      by: ['serviceId'],
      where: { serviceId: { in: serviceIds } },
      _avg: { rating: true },
      _count: { rating: true },
    });

    for (const g of grouped) {
      map.set(g.serviceId, {
        average: round1(g._avg.rating ?? 0),
        count: g._count.rating,
      });
    }
    return map;
  },

  async ratingForService(serviceId: string): Promise<Rating> {
    const [{ _avg, _count }] = [
      await prisma.review.aggregate({
        where: { serviceId },
        _avg: { rating: true },
        _count: { rating: true },
      }),
    ];
    return { average: round1(_avg.rating ?? 0), count: _count.rating };
  },

  /** Agregado de avaliações de todos os serviços de um prestador. */
  async ratingForProvider(providerId: string): Promise<Rating> {
    const { _avg, _count } = await prisma.review.aggregate({
      where: { service: { userId: providerId } },
      _avg: { rating: true },
      _count: { rating: true },
    });
    return { average: round1(_avg.rating ?? 0), count: _count.rating };
  },
};
