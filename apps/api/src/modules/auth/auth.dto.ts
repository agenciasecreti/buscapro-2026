import type { z } from 'zod';

import type { loginSchema, registerSchema } from './auth.schema';

export type RegisterDTO = z.infer<typeof registerSchema>;
export type LoginDTO = z.infer<typeof loginSchema>;

/**
 * Representação pública do usuário — nunca expõe o hash da senha.
 */
export type PublicUser = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: 'CLIENT' | 'PROVIDER';
  avatarUrl: string | null;
  createdAt: Date;
};

export type AuthResult = {
  token: string;
  user: PublicUser;
};
