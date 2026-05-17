import type { Request } from 'express';

import { HttpError } from './http-error';

/**
 * Lê um parâmetro de rota garantindo que seja uma string única.
 * Evita o tipo amplo `string | string[] | undefined` dos tipos do Express.
 */
export function requireParam(req: Request, name: string): string {
  const value = req.params[name];
  if (typeof value !== 'string' || value.length === 0) {
    throw new HttpError(400, 'INVALID_PARAM', `Parâmetro "${name}" inválido.`);
  }
  return value;
}
