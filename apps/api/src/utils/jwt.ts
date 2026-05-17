import * as jwt from 'jsonwebtoken';
import type { SignOptions } from 'jsonwebtoken';

import { env } from '../config/env';

import { HttpError } from './http-error';

export type JwtPayload = {
  sub: string;
  role: 'CLIENT' | 'PROVIDER';
};

/**
 * Assina um token JWT para o usuário autenticado.
 */
export function signToken(payload: JwtPayload): string {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN,
  } as SignOptions);
}

/**
 * Verifica e decodifica um token JWT.
 * Lança HttpError 401 quando inválido ou expirado.
 */
export function verifyToken(token: string): JwtPayload {
  try {
    const decoded = jwt.verify(token, env.JWT_SECRET);

    if (
      typeof decoded !== 'object' ||
      decoded === null ||
      typeof decoded.sub !== 'string'
    ) {
      throw new HttpError(401, 'INVALID_TOKEN', 'Token inválido.');
    }

    return { sub: decoded.sub, role: (decoded as JwtPayload).role };
  } catch (err) {
    if (err instanceof HttpError) throw err;
    throw new HttpError(401, 'INVALID_TOKEN', 'Token inválido ou expirado.');
  }
}
