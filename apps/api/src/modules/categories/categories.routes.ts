import { Router } from 'express';
import type { Router as ExpressRouter } from 'express';

import { asyncHandler } from '../../utils/async-handler';

import { categoriesController } from './categories.controller';

export const categoriesRouter: ExpressRouter = Router();

categoriesRouter.get('/', asyncHandler(categoriesController.list));
