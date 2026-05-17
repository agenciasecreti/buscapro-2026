/**
 * Acesso centralizado às variáveis de ambiente públicas/privadas do web.
 * Ler envs diretamente espalhado pelo código gera bugs sutis — use esta camada.
 */

export const env = {
  NODE_ENV: process.env.NODE_ENV ?? 'development',
  API_URL: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3333',
} as const;
