import { HttpError } from '../../utils/http-error';
import { signToken } from '../../utils/jwt';
import { comparePassword, hashPassword } from '../../utils/password';

import type { AuthResult, LoginDTO, PublicUser, RegisterDTO } from './auth.dto';
import { authRepository } from './auth.repository';

export const authService = {
  async register(data: RegisterDTO): Promise<AuthResult> {
    const existing = await authRepository.findByEmail(data.email);
    if (existing) {
      throw new HttpError(
        409,
        'EMAIL_IN_USE',
        'Este e-mail já está cadastrado.',
      );
    }

    const password = await hashPassword(data.password);

    const user = await authRepository.create({
      name: data.name,
      email: data.email,
      password,
      phone: data.phone ?? null,
      role: data.role,
    });

    return { token: signToken({ sub: user.id, role: user.role }), user };
  },

  async login(data: LoginDTO): Promise<AuthResult> {
    const user = await authRepository.findByEmail(data.email);

    // Mensagem genérica evita enumeração de e-mails cadastrados.
    const invalid = new HttpError(
      401,
      'INVALID_CREDENTIALS',
      'E-mail ou senha incorretos.',
    );

    if (!user) throw invalid;

    const ok = await comparePassword(data.password, user.password);
    if (!ok) throw invalid;

    const publicUser: PublicUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      avatarUrl: user.avatarUrl,
      createdAt: user.createdAt,
    };

    return {
      token: signToken({ sub: user.id, role: user.role }),
      user: publicUser,
    };
  },

  async me(userId: string): Promise<PublicUser> {
    const user = await authRepository.findPublicById(userId);
    if (!user) {
      throw new HttpError(404, 'USER_NOT_FOUND', 'Usuário não encontrado.');
    }
    return user;
  },
};
