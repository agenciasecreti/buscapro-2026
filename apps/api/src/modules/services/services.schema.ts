import { z } from 'zod';

import { paginationSchema } from '../../utils/pagination';

export const serviceListQuerySchema = paginationSchema.extend({
  q: z.string().trim().min(1).max(120).optional(),
  categoryId: z.string().trim().min(1).optional(),
  city: z.string().trim().min(1).max(80).optional(),
  state: z.string().trim().min(1).max(80).optional(),
  sort: z
    .enum(['recent', 'price_asc', 'price_desc', 'rating'])
    .default('recent'),
});

export const createServiceSchema = z.object({
  title: z.string().trim().min(4, 'Título muito curto.').max(120),
  description: z
    .string()
    .trim()
    .min(20, 'Descreva o serviço com pelo menos 20 caracteres.')
    .max(2000),
  price: z.coerce
    .number()
    .positive('Informe um preço válido.')
    .max(1_000_000),
  categoryId: z.string().trim().min(1, 'Selecione uma categoria.'),
  active: z.boolean().default(true),
  imageUrl: z.string().url('URL de imagem inválida.').nullish(),
});

export const updateServiceSchema = createServiceSchema.partial();

export type ServiceListQueryInput = z.infer<typeof serviceListQuerySchema>;
export type CreateServiceInput = z.infer<typeof createServiceSchema>;
export type UpdateServiceInput = z.infer<typeof updateServiceSchema>;
