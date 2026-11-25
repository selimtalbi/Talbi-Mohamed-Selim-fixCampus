import { Router } from 'express';
import { getMe, login, register } from '../controllers/auth.controller.js';

export const authRoutes = Router();

/**
 * @openapi
 * /api/auth/register:
 *   post:
 *     summary: Register a member account
 *     description: Creates a member account and returns a signed JWT. The role is always member.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password]
 *             properties:
 *               name: { type: string, example: Alex Student }
 *               email: { type: string, format: email, example: alex@example.com }
 *               password: { type: string, minLength: 8, example: secure-password }
 *     responses:
 *       201: { description: Member account created. }
 *       400: { description: Input is missing or invalid. }
 *       409: { description: Email is already registered. }
 *       500: { description: Server error. }
 */
authRoutes.post('/register', register);

/**
 * @openapi
 * /api/auth/login:
 *   post:
 *     summary: Log in to an account
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: { type: string, format: email, example: alex@example.com }
 *               password: { type: string, example: secure-password }
 *     responses:
 *       200: { description: Login succeeded; returns a JWT and public user data. }
 *       400: { description: Email or password is missing or invalid. }
 *       401: { description: Email or password is incorrect. }
 *       500: { description: Server error. }
 */
authRoutes.post('/login', login);

/**
 * @openapi
 * /api/auth/me:
 *   get:
 *     summary: Return the authenticated user
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200: { description: Current user returned. }
 *       401: { description: Bearer token is missing, invalid, expired, or no longer belongs to a user. }
 *       500: { description: Server error. }
 */
authRoutes.get('/me', getMe);
