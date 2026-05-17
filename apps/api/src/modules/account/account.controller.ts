import type { Request, Response } from 'express';
import { z } from 'zod';

import { HttpError } from '../../utils/http-error';

import { accountService } from './account.service';

const avatarSchema = z.object({
  avatarUrl: z.string().url('URL inválida.').nullable(),
});

export const accountController = {
  async updateAvatar(req: Request, res: Response): Promise<void> {
    if (!req.user) {
      throw new HttpError(401, 'UNAUTHENTICATED', 'Não autenticado.');
    }
    const { avatarUrl } = avatarSchema.parse(req.body);
    const data = await accountService.updateAvatar(req.user.id, avatarUrl);
    res.status(200).json({ success: true, data });
  },
};
