import type { ApiResponse } from '@buscapro/types';

import { env } from '@/lib/env';

/**
 * Erro tipado da API — carrega code/details vindos do envelope padrão
 * `{ success: false, error: { code, message, details } }`.
 */
export class ApiError extends Error {
  readonly code: string;
  readonly status: number;
  readonly details?: unknown;

  constructor(
    message: string,
    code: string,
    status: number,
    details?: unknown,
  ) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.status = status;
    this.details = details;
  }
}

export type QueryParams = Record<
  string,
  string | number | boolean | undefined | null
>;

export interface ApiFetchOptions extends Omit<RequestInit, 'body'> {
  body?: unknown;
  /** Bearer token — injeta o header Authorization. */
  token?: string | null;
  /** Parâmetros de querystring (valores vazios são ignorados). */
  query?: QueryParams;
}

function buildQuery(query?: QueryParams): string {
  if (!query) return '';
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (value === undefined || value === null || value === '') continue;
    params.set(key, String(value));
  }
  const qs = params.toString();
  return qs ? `?${qs}` : '';
}

/**
 * Cliente HTTP do BuscaPRO. Desembrulha o envelope `{ success, data }`
 * e lança `ApiError` com mensagem amigável quando algo falha.
 */
export async function apiFetch<T>(
  path: string,
  options: ApiFetchOptions = {},
): Promise<T> {
  const { body, token, headers, query, ...init } = options;
  const url = `${env.API_URL}${path.startsWith('/') ? path : `/${path}`}${buildQuery(query)}`;

  // FormData (uploads) é enviado cru — o browser define o boundary.
  const isFormData =
    typeof FormData !== 'undefined' && body instanceof FormData;

  let response: Response;
  try {
    response = await fetch(url, {
      ...init,
      headers: {
        ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...headers,
      },
      body:
        body === undefined
          ? undefined
          : isFormData
            ? (body as FormData)
            : JSON.stringify(body),
    });
  } catch {
    throw new ApiError(
      'Não foi possível conectar ao servidor. Verifique sua conexão.',
      'NETWORK_ERROR',
      0,
    );
  }

  const payload = (await response
    .json()
    .catch(() => null)) as ApiResponse<T> | null;

  if (!payload) {
    throw new ApiError(
      'Resposta inesperada do servidor.',
      'INVALID_RESPONSE',
      response.status,
    );
  }

  if (!payload.success) {
    throw new ApiError(
      payload.error.message,
      payload.error.code,
      response.status,
      payload.error.details,
    );
  }

  return payload.data;
}
