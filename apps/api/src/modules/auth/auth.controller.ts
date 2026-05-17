import type { Request, Response } from 'express';

import { HttpError } from '../../utils/http-error';

import { loginSchema, registerSchema } from './auth.schema';
import { authService } from './auth.service';

export const authController = {
  async register(req: Request, res: Response): Promise<void> {
    const data = registerSchema.parse(req.body);
    const result = await authService.register(data);
    res.status(201).json({ success: true, data: result });
  },

  async login(req: Request, res: Response): Promise<void> {
    const data = loginSchema.parse(req.body);
    const result = await authService.login(data);
    res.status(200).json({ success: true, data: result });
  },

  async me(req: Request, res: Response): Promise<void> {
    if (!req.user) {
      throw new HttpError(401, 'UNAUTHENTICATED', 'Não autenticado.');
    }
    const user = await authService.me(req.user.id);
    res.status(200).json({ success: true, data: user });
  },
};
