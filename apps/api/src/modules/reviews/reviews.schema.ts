import { z } from 'zod';

export const createReviewSchema = z.object({
  serviceId: z.string().trim().min(1, 'Serviço inválido.'),
  rating: z
    .number()
    .int('A nota deve ser um número inteiro.')
    .min(1, 'A nota mínima é 1.')
    .max(5, 'A nota máxima é 5.'),
  comment: z.string().trim().max(1000).optional(),
});

export type CreateReviewInput = z.infer<typeof createReviewSchema>;
