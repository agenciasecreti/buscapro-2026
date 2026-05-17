import type { Paginated, Service } from '@buscapro/types';

import { prisma } from '../../prisma';
import { HttpError } from '../../utils/http-error';
import { paginated, type Pagination } from '../../utils/pagination';
import { reviewsRepository } from '../reviews/reviews.repository';

import { mapService } from './services.mapper';
import { servicesRepository } from './services.repository';
import type {
  CreateServiceInput,
  ServiceListQueryInput,
  UpdateServiceInput,
} from './services.schema';

async function ensureCategoryExists(categoryId: string): Promise<void> {
  const category = await prisma.category.findUnique({
    where: { id: categoryId },
    select: { id: true },
  });
  if (!category) {
    throw new HttpError(400, 'INVALID_CATEGORY', 'Categoria inválida.');
  }
}

export const servicesService = {
  async list(
    query: ServiceListQueryInput,
    pagination: Pagination,
    ownerId?: string,
  ): Promise<Paginated<Service>> {
    const { rows, total } = await servicesRepository.list(
      { ...query, ownerId },
      pagination,
    );
    const ratings = await reviewsRepository.ratingsByServiceIds(
      rows.map((r) => r.id),
    );
    const items = rows.map((row) =>
      mapService(row, ratings.get(row.id) ?? { average: 0, count: 0 }),
    );
    return paginated(items, total, pagination);
  },

  async getById(id: string): Promise<Service> {
    const row = await servicesRepository.findById(id);
    if (!row) {
      throw new HttpError(404, 'SERVICE_NOT_FOUND', 'Serviço não encontrado.');
    }
    const rating = await reviewsRepository.ratingForService(id);
    return mapService(row, rating);
  },

  async create(
    input: CreateServiceInput,
    providerId: string,
  ): Promise<Service> {
    await ensureCategoryExists(input.categoryId);
    const row = await servicesRepository.create({
      ...input,
      userId: providerId,
    });
    return mapService(row, { average: 0, count: 0 });
  },

  async update(
    id: string,
    input: UpdateServiceInput,
    actorId: string,
  ): Promise<Service> {
    const ownerId = await servicesRepository.findOwnerId(id);
    if (!ownerId) {
      throw new HttpError(404, 'SERVICE_NOT_FOUND', 'Serviço não encontrado.');
    }
    if (ownerId !== actorId) {
      throw new HttpError(403, 'FORBIDDEN', 'Este serviço não é seu.');
    }
    if (input.categoryId) await ensureCategoryExists(input.categoryId);

    const row = await servicesRepository.update(id, input);
    const rating = await reviewsRepository.ratingForService(id);
    return mapService(row, rating);
  },

  async remove(id: string, actorId: string): Promise<void> {
    const ownerId = await servicesRepository.findOwnerId(id);
    if (!ownerId) {
      throw new HttpError(404, 'SERVICE_NOT_FOUND', 'Serviço não encontrado.');
    }
    if (ownerId !== actorId) {
      throw new HttpError(403, 'FORBIDDEN', 'Este serviço não é seu.');
    }
    await servicesRepository.delete(id);
  },
};
