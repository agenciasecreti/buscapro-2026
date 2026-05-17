import { z } from 'zod';

/**
 * Schemas de validação do módulo de autenticação.
 * São a fonte da verdade — os DTOs derivam destes schemas.
 */

export const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Informe seu nome completo.')
    .max(120, 'Nome muito longo.'),
  email: z.string().trim().toLowerCase().email('E-mail inválido.'),
  password: z
    .string()
    .min(8, 'A senha deve ter pelo menos 8 caracteres.')
    .max(72, 'A senha deve ter no máximo 72 caracteres.'),
  phone: z
    .string()
    .trim()
    .min(8, 'Telefone inválido.')
    .max(20, 'Telefone inválido.')
    .optional(),
  role: z.enum(['CLIENT', 'PROVIDER']).default('CLIENT'),
});

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email('E-mail inválido.'),
  password: z.string().min(1, 'Informe sua senha.'),
});
