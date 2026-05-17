import { Router } from 'express';
import type { Router as ExpressRouter } from 'express';

import { authenticate } from '../../middlewares';
import { asyncHandler } from '../../utils/async-handler';

import { authController } from './auth.controller';

export const authRouter: ExpressRouter = Router();

authRouter.post('/register', asyncHandler(authController.register));
authRouter.post('/login', asyncHandler(authController.login));
authRouter.get('/me', authenticate, asyncHandler(authController.me));
