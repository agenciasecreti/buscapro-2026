import type { PublicUser } from '@buscapro/types';

import { prisma } from '../../prisma';
import { HttpError } from '../../utils/http-error';
import { authRepository } from '../auth/auth.repository';

export const accountService = {
  async updateAvatar(
    userId: string,
    avatarUrl: string | null,
  ): Promise<PublicUser> {
    await prisma.user.update({
      where: { id: userId },
      data: { avatarUrl },
    });
    const user = await authRepository.findPublicById(userId);
    if (!user) {
      throw new HttpError(404, 'USER_NOT_FOUND', 'Usuário não encontrado.');
    }
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      avatarUrl: user.avatarUrl,
      createdAt: user.createdAt.toISOString(),
    };
  },
};
