import { HttpError } from '../utils/http-error.js';
import { getCurrentUser, loginUser, registerUser } from '../services/auth.service.js';

export async function register(request, response, next) {
  try {
    const result = await registerUser(request.body);
    response.status(201).json(result);
  } catch (error) {
    next(error);
  }
}

export async function login(request, response, next) {
  try {
    const result = await loginUser(request.body);
    response.json(result);
  } catch (error) {
    next(error);
  }
}

export async function getMe(request, response, next) {
  try {
    const authorization = request.get('authorization') || '';
    const parts = authorization.trim().split(/\s+/);
    const [scheme, token] = parts;

    if (parts.length !== 2 || scheme?.toLowerCase() !== 'bearer' || !token) {
      throw new HttpError('Bearer token is required', 401);
    }

    const user = await getCurrentUser(token);
    response.json({ user });
  } catch (error) {
    next(error);
  }
}
