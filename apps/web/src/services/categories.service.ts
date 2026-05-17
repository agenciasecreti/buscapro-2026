import type { Category } from '@buscapro/types';

import { apiFetch } from './http';

export const categoriesService = {
  list(): Promise<Category[]> {
    return apiFetch<Category[]>('/api/categories');
  },
};
