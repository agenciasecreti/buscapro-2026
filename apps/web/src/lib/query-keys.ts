import type { ServiceListQuery } from '@buscapro/types';

/**
 * Fonte única das query keys do React Query — evita strings soltas
 * e facilita invalidação consistente.
 */
export const queryKeys = {
  categories: ['categories'] as const,
  services: {
    all: ['services'] as const,
    list: (query: ServiceListQuery) =>
      ['services', 'list', query] as const,
    mine: (query: ServiceListQuery) =>
      ['services', 'mine', query] as const,
    detail: (id: string) => ['services', 'detail', id] as const,
    reviews: (id: string) => ['services', id, 'reviews'] as const,
  },
  providers: {
    detail: (id: string) => ['providers', id] as const,
  },
};
