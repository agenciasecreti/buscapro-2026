import type { Service } from '@buscapro/types';
import type { Prisma } from '@prisma/client';

/**
 * Forma de include reutilizada em todas as queries de serviço,
 * garantindo um shape estável para o mapper.
 */
export const serviceInclude = {
  category: true,
  user: {
    select: {
      id: true,
      name: true,
      avatarUrl: true,
      location: { select: { city: true, state: true } },
    },
  },
} satisfies Prisma.ServiceInclude;

export type ServiceRow = Prisma.ServiceGetPayload<{
  include: typeof serviceInclude;
}>;

export type Rating = { average: number; count: number };

export function mapService(row: ServiceRow, rating: Rating): Service {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    price: Number(row.price),
    active: row.active,
    imageUrl: row.imageUrl,
    createdAt: row.createdAt.toISOString(),
    category: {
      id: row.category.id,
      name: row.category.name,
      slug: row.category.slug,
    },
    provider: {
      id: row.user.id,
      name: row.user.name,
      avatarUrl: row.user.avatarUrl,
      city: row.user.location?.city ?? null,
      state: row.user.location?.state ?? null,
    },
    rating,
  };
}
