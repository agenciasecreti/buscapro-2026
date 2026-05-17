import type { RequestHandler } from 'express';

import { HttpError } from '../utils/http-error';

type Role = 'CLIENT' | 'PROVIDER';

/**
 * Restringe a rota aos papéis informados.
 * Deve rodar depois de `authenticate` (que preenche `req.user`).
 */
export function authorize(...roles: Role[]): RequestHandler {
  return (req, _res, next) => {
    if (!req.user) {
      throw new HttpError(401, 'UNAUTHENTICATED', 'Não autenticado.');
    }
    if (!roles.includes(req.user.role)) {
      throw new HttpError(
        403,
        'FORBIDDEN',
        'Você não tem permissão para esta ação.',
      );
    }
    next();
  };
}
