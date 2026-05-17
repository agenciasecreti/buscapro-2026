import { Router } from 'express';
import type { Router as ExpressRouter } from 'express';

import { authenticate } from '../../middlewares';
import { asyncHandler } from '../../utils/async-handler';

import { accountController } from './account.controller';

export const accountRouter: ExpressRouter = Router();

accountRouter.patch(
  '/avatar',
  authenticate,
  asyncHandler(accountController.updateAvatar),
);
