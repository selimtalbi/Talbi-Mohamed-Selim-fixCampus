import { Router } from 'express';
import { getHealth } from '../controllers/health.controller.js';

export const healthRoutes = Router();

/**
 * @openapi
 * /api/health:
 *   get:
 *     summary: Check API and database availability
 *     description: Executes a lightweight database query and reports service readiness.
 *     responses:
 *       200:
 *         description: API and database are ready.
 *       503:
 *         description: Database is unavailable.
 */
healthRoutes.get('/', getHealth);
