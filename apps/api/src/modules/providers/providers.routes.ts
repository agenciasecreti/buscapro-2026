import { Router } from 'express';
import type { Router as ExpressRouter } from 'express';

import { asyncHandler } from '../../utils/async-handler';

import { providersController } from './providers.controller';

export const providersRouter: ExpressRouter = Router();

providersRouter.get('/:id', asyncHandler(providersController.getProfile));
