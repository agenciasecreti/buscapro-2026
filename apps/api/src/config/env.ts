import 'dotenv/config';

import { z } from 'zod';

/**
 * Validação centralizada de envs.
 * Falha rápido na inicialização se algo estiver faltando ou inválido.
 */
const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  API_PORT: z.coerce.number().int().positive().default(3333),
  CORS_ORIGIN: z.string().url().default('http://localhost:3000'),
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string().min(16, 'JWT_SECRET deve ter pelo menos 16 caracteres.'),
  JWT_EXPIRES_IN: z.string().default('7d'),

  // URL pública desta API (usada para servir uploads locais)
  APP_PUBLIC_URL: z.string().url().default('http://localhost:3333'),

  // Armazenamento de mídia: 's3' (produção) ou 'local' (dev/demo)
  STORAGE_DRIVER: z.enum(['local', 's3']).default('local'),
  UPLOAD_DIR: z.string().default('uploads'),

  // S3 compatível (AWS S3, Cloudflare R2, MinIO, etc.)
  S3_ENDPOINT: z.string().url().optional(),
  S3_REGION: z.string().default('us-east-1'),
  S3_BUCKET: z.string().optional(),
  S3_ACCESS_KEY_ID: z.string().optional(),
  S3_SECRET_ACCESS_KEY: z.string().optional(),
  S3_PUBLIC_URL: z.string().url().optional(),
  S3_FORCE_PATH_STYLE: z
    .enum(['true', 'false'])
    .default('false')
    .transform((v) => v === 'true'),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('❌ Envs inválidas:', parsed.error.flatten().fieldErrors);
  throw new Error('Variáveis de ambiente inválidas. Verifique seu .env.');
}

if (parsed.data.STORAGE_DRIVER === 's3') {
  const missing = (
    ['S3_BUCKET', 'S3_ACCESS_KEY_ID', 'S3_SECRET_ACCESS_KEY', 'S3_PUBLIC_URL'] as const
  ).filter((k) => !parsed.data[k]);
  if (missing.length > 0) {
    throw new Error(
      `STORAGE_DRIVER=s3 requer: ${missing.join(', ')}. Configure ou use STORAGE_DRIVER=local.`,
    );
  }
}

export const env = parsed.data;
export type Env = typeof env;
