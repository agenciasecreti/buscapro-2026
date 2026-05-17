import { createApp } from './app';
import { env } from './config/env';
import { prisma } from './prisma';

async function bootstrap(): Promise<void> {
  const app = createApp();

  const server = app.listen(env.API_PORT, () => {
    console.info(`🚀 BuscaPRO API rodando em http://localhost:${env.API_PORT}`);
    console.info(`📦 Ambiente: ${env.NODE_ENV}`);
  });

  const shutdown = async (signal: string): Promise<void> => {
    console.info(`\n${signal} recebido. Finalizando...`);
    server.close(() => console.info('HTTP server fechado.'));
    await prisma.$disconnect();
    process.exit(0);
  };

  process.on('SIGINT', () => void shutdown('SIGINT'));
  process.on('SIGTERM', () => void shutdown('SIGTERM'));

  process.on('unhandledRejection', (reason) => {
    console.error('[unhandledRejection]', reason);
  });
  process.on('uncaughtException', (err) => {
    console.error('[uncaughtException]', err);
  });
}

bootstrap().catch((err) => {
  console.error('Falha ao iniciar a API:', err);
  process.exit(1);
});
