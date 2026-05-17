import { Router } from 'express';
import type { Router as ExpressRouter } from 'express';

import { authenticate, authorize } from '../../middlewares';
import { asyncHandler } from '../../utils/async-handler';
import { reviewsController } from '../reviews';

import { servicesController } from './services.controller';

export const servicesRouter: ExpressRouter = Router();

// Rotas específicas antes de "/:id" para não serem capturadas por ela.
servicesRouter.get('/', asyncHandler(servicesController.list));

servicesRouter.get(
  '/mine',
  authenticate,
  authorize('PROVIDER'),
  asyncHandler(servicesController.listMine),
);

servicesRouter.post(
  '/',
  authenticate,
  authorize('PROVIDER'),
  asyncHandler(servicesController.create),
);

servicesRouter.get('/:id', asyncHandler(servicesController.getById));
servicesRouter.get(
  '/:id/reviews',
  asyncHandler(reviewsController.listByService),
);

servicesRouter.put(
  '/:id',
  authenticate,
  authorize('PROVIDER'),
  asyncHandler(servicesController.update),
);

servicesRouter.delete(
  '/:id',
  authenticate,
  authorize('PROVIDER'),
  asyncHandler(servicesController.remove),
);
