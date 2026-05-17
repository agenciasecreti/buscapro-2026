import type { Request, Response } from 'express';

import { requireParam } from '../../utils/request';

import { providersService } from './providers.service';

export const providersController = {
  async getProfile(req: Request, res: Response): Promise<void> {
    const data = await providersService.getProfile(requireParam(req, 'id'));
    res.status(200).json({ success: true, data });
  },
};
