import { z } from 'zod';

export const DEFAULT_PAGE_SIZE = 12;
export const MAX_PAGE_SIZE = 50;

/**
 * Schema reutilizável de paginação (page/pageSize) com coerção e limites.
 */
export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce
    .number()
    .int()
    .positive()
    .max(MAX_PAGE_SIZE)
    .default(DEFAULT_PAGE_SIZE),
});

export type Pagination = z.infer<typeof paginationSchema>;

export function toSkipTake({ page, pageSize }: Pagination): {
  skip: number;
  take: number;
} {
  return { skip: (page - 1) * pageSize, take: pageSize };
}

export function paginated<T>(
  items: T[],
  total: number,
  { page, pageSize }: Pagination,
): { items: T[]; page: number; pageSize: number; total: number } {
  return { items, page, pageSize, total };
}
