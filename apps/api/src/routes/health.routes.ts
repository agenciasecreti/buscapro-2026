import { Router } from 'express';
import type { Router as ExpressRouter } from 'express';

import { prisma } from '../prisma';

export const healthRouter: ExpressRouter = Router();

/** Liveness — processo no ar (usado pelo healthcheck do Docker). */
healthRouter.get('/', (_req, res) => {
  res.json({
    success: true,
    data: {
      status: 'ok',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    },
  });
});

/** Readiness — verifica conectividade com o banco. */
healthRouter.get('/ready', async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({
      success: true,
      data: { status: 'ready', database: 'up' },
    });
  } catch {
    res.status(503).json({
      success: false,
      error: {
        code: 'NOT_READY',
        message: 'Banco de dados indisponível.',
      },
    });
  }
});
