import type {
  AuthResult,
  LoginPayload,
  PublicUser,
  RegisterPayload,
} from '@buscapro/types';

import { apiFetch } from './http';

export const authService = {
  register(payload: RegisterPayload): Promise<AuthResult> {
    return apiFetch<AuthResult>('/api/auth/register', {
      method: 'POST',
      body: payload,
    });
  },

  login(payload: LoginPayload): Promise<AuthResult> {
    return apiFetch<AuthResult>('/api/auth/login', {
      method: 'POST',
      body: payload,
    });
  },

  me(token: string): Promise<PublicUser> {
    return apiFetch<PublicUser>('/api/auth/me', { token });
  },
};
