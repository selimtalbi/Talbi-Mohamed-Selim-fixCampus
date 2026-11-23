import 'dotenv/config';
import { app } from './app.js';
import { pool } from './db.js';

const port = Number(process.env.API_PORT || 5000);
app.listen(port, '0.0.0.0', () => console.log(`FixIt Campus API listening on port ${port}`));

for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, async () => { await pool.end(); process.exit(0); });
}
