import type { Request, Response } from 'express';
import { z } from 'zod';

import { HttpError } from '../../utils/http-error';

import { uploadsService } from './uploads.service';

const bodySchema = z.object({
  type: z.enum(['avatar', 'service']),
});

export const uploadsController = {
  async upload(req: Request, res: Response): Promise<void> {
    if (!req.user) {
      throw new HttpError(401, 'UNAUTHENTICATED', 'Não autenticado.');
    }
    const { type } = bodySchema.parse(req.body);
    const data = await uploadsService.upload(req.user.id, type, req.file);
    res.status(201).json({ success: true, data });
  },
};
