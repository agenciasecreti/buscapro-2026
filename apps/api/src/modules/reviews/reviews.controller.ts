import type { Request, Response } from 'express';

import { HttpError } from '../../utils/http-error';
import { requireParam } from '../../utils/request';

import { createReviewSchema } from './reviews.schema';
import { reviewsService } from './reviews.service';

export const reviewsController = {
  async create(req: Request, res: Response): Promise<void> {
    if (!req.user) {
      throw new HttpError(401, 'UNAUTHENTICATED', 'Não autenticado.');
    }
    const input = createReviewSchema.parse(req.body);
    const data = await reviewsService.create(input, req.user.id);
    res.status(201).json({ success: true, data });
  },

  async listByService(req: Request, res: Response): Promise<void> {
    const data = await reviewsService.listByService(requireParam(req, 'id'));
    res.status(200).json({ success: true, data });
  },
};
