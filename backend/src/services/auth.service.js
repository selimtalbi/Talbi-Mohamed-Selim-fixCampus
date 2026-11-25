import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { pool } from '../db.js';
import { HttpError } from '../utils/http-error.js';

const passwordRounds = 12;
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function normalizeEmail(email) {
  if (typeof email !== 'string') {
    throw new HttpError('A valid email is required', 400);
  }

  const normalizedEmail = email.trim().toLowerCase();
  if (!emailPattern.test(normalizedEmail) || normalizedEmail.length > 255) {
    throw new HttpError('A valid email is required', 400);
  }

  return normalizedEmail;
}

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 32) {
    throw new HttpError('JWT_SECRET must be configured with at least 32 characters', 500);
  }

  return secret;
}

function toPublicUser(row) {
  return {
    id: Number(row.id),
    name: row.name,
    email: row.email,
    role: row.role
  };
}

function createToken(user) {
  return jwt.sign({}, getJwtSecret(), {
    algorithm: 'HS256',
    subject: String(user.id),
    expiresIn: process.env.JWT_EXPIRES_IN || '1h'
  });
}

function createAuthResponse(row) {
  const user = toPublicUser(row);
  return { user, token: createToken(user) };
}

function validateName(name) {
  if (typeof name !== 'string' || !name.trim() || name.trim().length > 120) {
    throw new HttpError('Name is required and must be at most 120 characters', 400);
  }

  return name.trim();
}

function validatePassword(password) {
  if (typeof password !== 'string' || password.length < 8 || Buffer.byteLength(password, 'utf8') > 72) {
    throw new HttpError('Password must be at least 8 characters and no more than 72 bytes', 400);
  }
}

export async function registerUser(input = {}) {
  getJwtSecret();
  const data = input && typeof input === 'object' ? input : {};
  const name = validateName(data.name);
  const email = normalizeEmail(data.email);
  validatePassword(data.password);

  const existingUser = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
  if (existingUser.rowCount > 0) {
    throw new HttpError('Email is already registered', 409);
  }

  const passwordHash = await bcrypt.hash(data.password, passwordRounds);

  try {
    const result = await pool.query(
      `INSERT INTO users (name, email, password_hash, role)
       VALUES ($1, $2, $3, 'member')
       RETURNING id, name, email, role`,
      [name, email, passwordHash]
    );

    return createAuthResponse(result.rows[0]);
  } catch (error) {
    if (error.code === '23505') {
      throw new HttpError('Email is already registered', 409);
    }

    throw error;
  }
}

export async function loginUser(input = {}) {
  getJwtSecret();
  const data = input && typeof input === 'object' ? input : {};
  const email = normalizeEmail(data.email);
  if (typeof data.password !== 'string' || data.password.length === 0) {
    throw new HttpError('Password is required', 400);
  }

  const result = await pool.query(
    'SELECT id, name, email, password_hash, role FROM users WHERE email = $1',
    [email]
  );
  const row = result.rows[0];

  if (!row?.password_hash || !(await bcrypt.compare(data.password, row.password_hash))) {
    throw new HttpError('Email or password is incorrect', 401);
  }

  return createAuthResponse(row);
}

export async function getCurrentUser(token) {
  const secret = getJwtSecret();
  let payload;

  try {
    payload = jwt.verify(token, secret, { algorithms: ['HS256'] });
  } catch {
    throw new HttpError('Bearer token is invalid or expired', 401);
  }

  const userId = Number(payload.sub);
  if (!Number.isSafeInteger(userId) || userId < 1) {
    throw new HttpError('Bearer token is invalid', 401);
  }

  const result = await pool.query(
    'SELECT id, name, email, role FROM users WHERE id = $1',
    [userId]
  );

  if (result.rowCount === 0) {
    throw new HttpError('User no longer exists', 401);
  }

  return toPublicUser(result.rows[0]);
}
