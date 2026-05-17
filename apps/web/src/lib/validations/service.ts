import { z } from 'zod';

/** Espelha apps/api services.schema (createServiceSchema). */
export const serviceFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(4, 'Título muito curto.')
    .max(120, 'Máx. 120 caracteres.'),
  description: z
    .string()
    .trim()
    .min(20, 'Descreva com pelo menos 20 caracteres.')
    .max(2000, 'Máx. 2000 caracteres.'),
  price: z.coerce
    .number({ invalid_type_error: 'Informe um preço.' })
    .positive('Informe um preço válido.')
    .max(1_000_000, 'Preço muito alto.'),
  categoryId: z.string().min(1, 'Selecione uma categoria.'),
  active: z.boolean(),
  imageUrl: z.string().url().nullable(),
});

export type ServiceFormValues = z.infer<typeof serviceFormSchema>;
