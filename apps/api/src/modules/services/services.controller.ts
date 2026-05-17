import type { Request, Response } from 'express';

import { HttpError } from '../../utils/http-error';
import { paginationSchema } from '../../utils/pagination';
import { requireParam } from '../../utils/request';

import {
  createServiceSchema,
  serviceListQuerySchema,
  updateServiceSchema,
} from './services.schema';
import { servicesService } from './services.service';

function requireUserId(req: Request): string {
  if (!req.user) {
    throw new HttpError(401, 'UNAUTHENTICATED', 'Não autenticado.');
  }
  return req.user.id;
}

export const servicesController = {
  async list(req: Request, res: Response): Promise<void> {
    const query = serviceListQuerySchema.parse(req.query);
    const pagination = paginationSchema.parse(req.query);
    const data = await servicesService.list(query, pagination);
    res.status(200).json({ success: true, data });
  },

  async listMine(req: Request, res: Response): Promise<void> {
    const query = serviceListQuerySchema.parse(req.query);
    const pagination = paginationSchema.parse(req.query);
    const data = await servicesService.list(
      query,
      pagination,
      requireUserId(req),
    );
    res.status(200).json({ success: true, data });
  },

  async getById(req: Request, res: Response): Promise<void> {
    const data = await servicesService.getById(requireParam(req, 'id'));
    res.status(200).json({ success: true, data });
  },

  async create(req: Request, res: Response): Promise<void> {
    const input = createServiceSchema.parse(req.body);
    const data = await servicesService.create(input, requireUserId(req));
    res.status(201).json({ success: true, data });
  },

  async update(req: Request, res: Response): Promise<void> {
    const input = updateServiceSchema.parse(req.body);
    const data = await servicesService.update(
      requireParam(req, 'id'),
      input,
      requireUserId(req),
    );
    res.status(200).json({ success: true, data });
  },

  async remove(req: Request, res: Response): Promise<void> {
    const id = requireParam(req, 'id');
    await servicesService.remove(id, requireUserId(req));
    res.status(200).json({ success: true, data: { id } });
  },
};
