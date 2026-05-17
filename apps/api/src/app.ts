import { join } from 'node:path';

import compression from 'compression';
import cors from 'cors';
import express, {
  type Express,
  json,
  urlencoded,
  static as serveStatic,
} from 'express';
import helmet from 'helmet';
import morgan from 'morgan';

import { env } from './config/env';
import { errorHandler, notFoundHandler } from './middlewares';
import { router } from './routes';

export function createApp(): Express {
  const app = express();

  app.disable('x-powered-by');
  app.set('trust proxy', 1);

  app.use(
    helmet({
      // Permite que o web (outra origem) carregue imagens servidas pela API.
      crossOriginResourcePolicy: { policy: 'cross-origin' },
    }),
  );
  app.use(compression());
  app.use(
    cors({
      origin: env.CORS_ORIGIN,
      credentials: true,
    }),
  );
  app.use(json({ limit: '1mb' }));
  app.use(urlencoded({ extended: true }));

  if (env.NODE_ENV !== 'test') {
    app.use(
      morgan(env.NODE_ENV === 'production' ? 'combined' : 'dev', {
        skip: (req) => req.url === '/api/health',
      }),
    );
  }

  // Uploads locais (STORAGE_DRIVER=local) servidos estaticamente.
  if (env.STORAGE_DRIVER === 'local') {
    app.use(
      `/${env.UPLOAD_DIR}`,
      serveStatic(join(process.cwd(), env.UPLOAD_DIR), {
        immutable: true,
        maxAge: '1y',
        fallthrough: false,
      }),
    );
  }

  app.use('/api', router);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
