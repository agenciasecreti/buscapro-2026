import type { NextFunction, Request, RequestHandler, Response } from 'express';

/**
 * Encapsula handlers async — encaminha rejeições para o errorHandler.
 * Express 4 não captura promessas rejeitadas automaticamente.
 */
export function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>,
): RequestHandler {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
}
