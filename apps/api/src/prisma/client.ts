import { PrismaClient } from '@prisma/client';

import { env } from '../config/env';

/**
 * Instância singleton do PrismaClient.
 * Em dev, o hot-reload pode criar várias instâncias — guardamos em globalThis.
 */
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
