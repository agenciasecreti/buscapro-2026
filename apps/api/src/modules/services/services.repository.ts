import type { Prisma } from '@prisma/client';

import { prisma } from '../../prisma';
import { toSkipTake, type Pagination } from '../../utils/pagination';

import { serviceInclude, type ServiceRow } from './services.mapper';
import type { ServiceListQueryInput } from './services.schema';

type ListParams = ServiceListQueryInput & {
  /** Quando definido, retorna apenas serviços deste prestador (inclui inativos). */
  ownerId?: string;
};

function buildWhere(params: ListParams): Prisma.ServiceWhereInput {
  const where: Prisma.ServiceWhereInput = {};

  if (params.ownerId) {
    where.userId = params.ownerId;
  } else {
    where.active = true;
  }

  if (params.q) {
    where.OR = [
      { title: { contains: params.q, mode: 'insensitive' } },
      { description: { contains: params.q, mode: 'insensitive' } },
    ];
  }
  if (params.categoryId) where.categoryId = params.categoryId;

  if (params.city || params.state) {
    where.user = {
      location: {
        ...(params.city
          ? { city: { equals: params.city, mode: 'insensitive' } }
          : {}),
        ...(params.state
          ? { state: { equals: params.state, mode: 'insensitive' } }
          : {}),
      },
    };
  }

  return where;
}

function buildOrderBy(
  sort: ServiceListQueryInput['sort'],
): Prisma.ServiceOrderByWithRelationInput {
  switch (sort) {
    case 'price_asc':
      return { price: 'asc' };
    case 'price_desc':
      return { price: 'desc' };
    case 'rating':
      return { reviews: { _count: 'desc' } };
    default:
      return { createdAt: 'desc' };
  }
}

export const servicesRepository = {
  async list(
    params: ListParams,
    pagination: Pagination,
  ): Promise<{ rows: ServiceRow[]; total: number }> {
    const where = buildWhere(params);
    const [rows, total] = await Promise.all([
      prisma.service.findMany({
        where,
        include: serviceInclude,
        orderBy: buildOrderBy(params.sort),
        ...toSkipTake(pagination),
      }),
      prisma.service.count({ where }),
    ]);
    return { rows, total };
  },

  findById(id: string): Promise<ServiceRow | null> {
    return prisma.service.findUnique({ where: { id }, include: serviceInclude });
  },

  async findOwnerId(id: string): Promise<string | null> {
    const row = await prisma.service.findUnique({
      where: { id },
      select: { userId: true },
    });
    return row?.userId ?? null;
  },

  create(
    data: Prisma.ServiceUncheckedCreateInput,
  ): Promise<ServiceRow> {
    return prisma.service.create({ data, include: serviceInclude });
  },

  update(
    id: string,
    data: Prisma.ServiceUncheckedUpdateInput,
  ): Promise<ServiceRow> {
    return prisma.service.update({
      where: { id },
      data,
      include: serviceInclude,
    });
  },

  async delete(id: string): Promise<void> {
    await prisma.service.delete({ where: { id } });
  },
};
