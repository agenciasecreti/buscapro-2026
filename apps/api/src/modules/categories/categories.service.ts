import type { Category } from '@buscapro/types';

import { categoriesRepository } from './categories.repository';

export const categoriesService = {
  async list(): Promise<Category[]> {
    const categories = await categoriesRepository.listAll();
    return categories.map((c) => ({ id: c.id, name: c.name, slug: c.slug }));
  },
};
