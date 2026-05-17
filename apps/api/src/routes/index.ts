import { Router } from 'express';
import type { Router as ExpressRouter } from 'express';

import { accountRouter } from '../modules/account';
import { authRouter } from '../modules/auth';
import { categoriesRouter } from '../modules/categories';
import { providersRouter } from '../modules/providers';
import { reviewsRouter } from '../modules/reviews';
import { servicesRouter } from '../modules/services';
import { uploadsRouter } from '../modules/uploads';

import { healthRouter } from './health.routes';

/**
 * Router raiz da API.
 * Monte novos módulos aqui (ex.: bookings, favorites).
 */
export const router: ExpressRouter = Router();

router.use('/health', healthRouter);
router.use('/auth', authRouter);
router.use('/me', accountRouter);
router.use('/categories', categoriesRouter);
router.use('/services', servicesRouter);
router.use('/providers', providersRouter);
router.use('/reviews', reviewsRouter);
router.use('/uploads', uploadsRouter);
