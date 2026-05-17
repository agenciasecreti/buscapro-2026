import { Router } from 'express';
import type { Router as ExpressRouter } from 'express';

import { authenticate } from '../../middlewares';
import { asyncHandler } from '../../utils/async-handler';

import { singleImage } from './upload.middleware';
import { uploadsController } from './uploads.controller';

export const uploadsRouter: ExpressRouter = Router();

uploadsRouter.post(
  '/',
  authenticate,
  singleImage,
  asyncHandler(uploadsController.upload),
);
