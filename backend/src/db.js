import pg from 'pg';
const { Pool } = pg;

export const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || 5432),
  user: process.env.POSTGRES_USER || 'fixit',
  password: process.env.POSTGRES_PASSWORD || 'fixit_dev_password',
  database: process.env.POSTGRES_DB || 'fixitcampus'
});

export async function initializeDatabase() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS rooms (
      id SERIAL PRIMARY KEY, name VARCHAR(120) NOT NULL, building VARCHAR(120) NOT NULL,
      floor INTEGER NOT NULL DEFAULT 0, equipment_type VARCHAR(120), created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
    CREATE TABLE IF NOT EXISTS tickets (
      id SERIAL PRIMARY KEY, title VARCHAR(180) NOT NULL, description TEXT NOT NULL,
      priority VARCHAR(20) NOT NULL DEFAULT 'medium' CHECK (priority IN ('low','medium','high','critical')),
      status VARCHAR(30) NOT NULL DEFAULT 'open' CHECK (status IN ('open','in progress','resolved','closed')),
      room_id INTEGER REFERENCES rooms(id) ON DELETE SET NULL, author VARCHAR(160) NOT NULL,
      assigned_technician VARCHAR(160), created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
    CREATE TABLE IF NOT EXISTS interventions (
      id SERIAL PRIMARY KEY, ticket_id INTEGER REFERENCES tickets(id) ON DELETE CASCADE,
      technician VARCHAR(160) NOT NULL, comment TEXT NOT NULL, occurred_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);
}
