import { Router } from 'express';
import type { Router as ExpressRouter } from 'express';

import { authenticate, authorize } from '../../middlewares';
import { asyncHandler } from '../../utils/async-handler';

import { reviewsController } from './reviews.controller';

export const reviewsRouter: ExpressRouter = Router();

reviewsRouter.post(
  '/',
  authenticate,
  authorize('CLIENT'),
  asyncHandler(reviewsController.create),
);
