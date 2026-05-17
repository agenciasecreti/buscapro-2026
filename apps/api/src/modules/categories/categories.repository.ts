import type { Category } from '@prisma/client';

import { prisma } from '../../prisma';

export const categoriesRepository = {
  listAll(): Promise<Category[]> {
    return prisma.category.findMany({ orderBy: { name: 'asc' } });
  },
};
