import { pool } from '../db.js';

export async function checkDatabaseConnection() {
  try {
    await pool.query('SELECT 1');
  } catch {
    const error = new Error('Database is unavailable');
    error.code = 'DATABASE_UNAVAILABLE';
    throw error;
  }
}
