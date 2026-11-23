import express from 'express';
import cors from 'cors';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { pool } from './db.js';

export const app = express();
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:4200' }));
app.use(express.json());

const swaggerSpec = swaggerJSDoc({
  definition: { openapi: '3.0.0', info: { title: 'FixIt Campus API', version: '1.0.0', description: 'API for campus maintenance services.' }, servers: [{ url: 'http://localhost:5000' }] },
  apis: ['./src/app.js']
});
app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

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
app.get('/api/health', async (_request, response) => {
  try {
    await pool.query('SELECT 1');
    response.json({ status: 'ok', database: 'connected' });
  } catch {
    response.status(503).json({ status: 'error', database: 'unavailable' });
  }
});

/**
 * @openapi
 * /api:
 *   get:
 *     summary: Describe the FixIt Campus API
 *     responses:
 *       200:
 *         description: API name and documentation path.
 */
app.get('/api', (_request, response) => response.json({ name: 'FixIt Campus API', documentation: '/swagger' }));
app.use((_request, response) => response.status(404).json({ error: 'Route not found' }));
