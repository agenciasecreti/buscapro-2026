import { prisma } from '../../prisma';
import { serviceInclude } from '../services/services.mapper';

export const providersRepository = {
  findProvider(id: string) {
    return prisma.user.findFirst({
      where: { id, role: 'PROVIDER' },
      select: {
        id: true,
        name: true,
        avatarUrl: true,
        phone: true,
        role: true,
        createdAt: true,
        location: { select: { city: true, state: true } },
      },
    });
  },

  listProviderServices(providerId: string) {
    return prisma.service.findMany({
      where: { userId: providerId, active: true },
      include: serviceInclude,
      orderBy: { createdAt: 'desc' },
    });
  },

  listProviderReviews(providerId: string) {
    return prisma.review.findMany({
      where: { service: { userId: providerId } },
      orderBy: { createdAt: 'desc' },
      take: 20,
      include: {
        reviewer: { select: { id: true, name: true, avatarUrl: true } },
      },
    });
  },
};
