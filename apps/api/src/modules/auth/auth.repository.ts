import type { Prisma, User } from '@prisma/client';

import { prisma } from '../../prisma';

import type { PublicUser } from './auth.dto';

/**
 * Campos seguros para retornar ao cliente (sem o hash da senha).
 */
const publicUserSelect = {
  id: true,
  name: true,
  email: true,
  phone: true,
  role: true,
  avatarUrl: true,
  createdAt: true,
} satisfies Prisma.UserSelect;

export const authRepository = {
  findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { email } });
  },

  findPublicById(id: string): Promise<PublicUser | null> {
    return prisma.user.findUnique({
      where: { id },
      select: publicUserSelect,
    });
  },

  create(data: Prisma.UserCreateInput): Promise<PublicUser> {
    return prisma.user.create({ data, select: publicUserSelect });
  },
};
