import 'dotenv/config';
import { app } from './app.js';
import { initializeDatabase, pool } from './db.js';

const port = Number(process.env.API_PORT || 5000);
try {
  await initializeDatabase();
  app.listen(port, '0.0.0.0', () => console.log(`FixIt Campus API listening on port ${port}`));
} catch (error) {
  console.error('Could not initialize the database:', error);
  await pool.end();
  process.exit(1);
}

for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, async () => { await pool.end(); process.exit(0); });
}
