import pg from 'pg';
const { Pool } = pg;

export const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || 5432),
  user: process.env.POSTGRES_USER || 'fixit',
  password: process.env.POSTGRES_PASSWORD || 'fixit_dev_password',
  database: process.env.POSTGRES_DB || 'fixitcampus'
});
