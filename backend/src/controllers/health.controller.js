import { checkDatabaseConnection } from '../services/database.service.js';

export async function getHealth(_request, response, next) {
  try {
    await checkDatabaseConnection();
    response.json({ status: 'ok', database: 'connected' });
  } catch (error) {
    if (error.code === 'DATABASE_UNAVAILABLE') {
      response.status(503).json({ status: 'error', database: 'unavailable' });
      return;
    }

    next(error);
  }
}
