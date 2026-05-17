/**
 * Augmenta o Request do Express com o usuário autenticado,
 * preenchido pelo middleware `authenticate`.
 */
declare global {
  namespace Express {
    interface UserContext {
      id: string;
      role: 'CLIENT' | 'PROVIDER';
    }

    interface Request {
      user?: UserContext;
    }
  }
}

export {};
