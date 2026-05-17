import type { RequestHandler } from 'express';

import { HttpError } from '../utils/http-error';
import { verifyToken } from '../utils/jwt';

/**
 * Exige um Bearer token válido. Preenche `req.user` quando autenticado.
 */
export const authenticate: RequestHandler = (req, _res, next) => {
  const header = req.headers.authorization;

  if (!header?.startsWith('Bearer ')) {
    throw new HttpError(
      401,
      'UNAUTHENTICATED',
      'Token de autenticação ausente.',
    );
  }

  const token = header.slice('Bearer '.length).trim();
  const payload = verifyToken(token);

  req.user = { id: payload.sub, role: payload.role };
  next();
};
