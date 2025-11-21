import db from '../db';
import bcrypt from 'bcrypt';

export type User = {
  id?: number;
  email: string;
  first_name?: string;
  last_name?: string;
  is_admin?: boolean;
  created_at?: string;
};

const SALT_ROUNDS = +(process.env.BCRYPT_SALT_ROUNDS || 10);

export async function createUser(email: string, password: string, first_name?: string, last_name?: string) {
  const hash = await bcrypt.hash(password, SALT_ROUNDS);
  const result = await db.query(
    `INSERT INTO users (email, password_hash, first_name, last_name) VALUES ($1,$2,$3,$4) RETURNING id,email,first_name,last_name,is_admin,created_at`,
    [email, hash, first_name, last_name]
  );
  return result.rows[0];
}

export async function findUserByEmail(email: string) {
  const res = await db.query(`SELECT * FROM users WHERE email=$1`, [email]);
  return res.rows[0];
}

export async function findUserById(id: number) {
  const res = await db.query(`SELECT id,email,first_name,last_name,is_admin,created_at FROM users WHERE id=$1`, [id]);
  return res.rows[0];
}

export async function verifyPassword(email: string, password: string) {
  const res = await db.query(`SELECT id, password_hash FROM users WHERE email=$1`, [email]);
  if (res.rowCount === 0) return false;
  const user = res.rows[0];
  const ok = await bcrypt.compare(password, user.password_hash);
  return ok ? user.id : false;
}
