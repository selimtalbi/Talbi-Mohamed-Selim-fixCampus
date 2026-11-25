import { Router } from 'express';
import { getApiInfo } from '../controllers/api.controller.js';
import { healthRoutes } from './health.routes.js';
import { authRoutes } from './auth.routes.js';

export const apiRoutes = Router();

/**
 * @openapi
 * /api:
 *   get:
 *     summary: Describe the FixIt Campus API
 *     responses:
 *       200:
 *         description: API name and documentation path.
 */
apiRoutes.get('/', getApiInfo);
apiRoutes.use('/health', healthRoutes);
apiRoutes.use('/auth', authRoutes);
