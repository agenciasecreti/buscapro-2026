import { z } from 'zod';

/**
 * Schemas de formulário — espelham as regras da API (apps/api auth.schema).
 * Validação client-side para feedback imediato; a API revalida sempre.
 */

export const loginSchema = z.object({
  email: z.string().min(1, 'Informe seu e-mail.').email('E-mail inválido.'),
  password: z.string().min(1, 'Informe sua senha.'),
});

export const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Informe seu nome completo.')
    .max(120, 'Nome muito longo.'),
  email: z.string().min(1, 'Informe seu e-mail.').email('E-mail inválido.'),
  password: z
    .string()
    .min(8, 'A senha deve ter pelo menos 8 caracteres.')
    .max(72, 'Senha muito longa.'),
  phone: z
    .string()
    .trim()
    .min(8, 'Telefone inválido.')
    .optional()
    .or(z.literal('')),
  role: z.enum(['CLIENT', 'PROVIDER']),
});

export type LoginValues = z.infer<typeof loginSchema>;
export type RegisterValues = z.infer<typeof registerSchema>;
