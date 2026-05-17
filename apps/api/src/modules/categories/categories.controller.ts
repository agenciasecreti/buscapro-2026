import type { Request, Response } from 'express';

import { categoriesService } from './categories.service';

export const categoriesController = {
  async list(_req: Request, res: Response): Promise<void> {
    const data = await categoriesService.list();
    res.status(200).json({ success: true, data });
  },
};
