import db from '../db';
import bcrypt from 'bcrypt';

export type User = {
  id?: number;
  email: string;
  first_name?: string;
  last_name?: string;
  is_admin?: boolean;
  created_at?: string;
  password_hash?: string;
};

const SALT_ROUNDS = +(process.env.BCRYPT_SALT_ROUNDS || 10);

export async function index(): Promise<User[]> {
  try {
    const res = await db.query('SELECT id, email, first_name, last_name, is_admin, created_at FROM users');
    return res.rows;
  } catch (err) {
    throw new Error(`Could not get users. Error: ${err}`);
  }
}

export async function createUser(email: string, password: string, first_name?: string, last_name?: string) {
  try {
    const hash = await bcrypt.hash(password, SALT_ROUNDS);
    const result = await db.query(
      `INSERT INTO users (email, password_hash, first_name, last_name) VALUES ($1,$2,$3,$4) RETURNING id,email,first_name,last_name,is_admin,created_at`,
      [email, hash, first_name, last_name]
    );
    return result.rows[0];
  } catch (err) {
    throw new Error(`Could not create user. Error: ${err}`);
  }
}

export async function findUserByEmail(email: string) {
  try {
    const res = await db.query(`SELECT * FROM users WHERE email=$1`, [email]);
    return res.rows[0];
  } catch (err) {
    throw new Error(`Could not find user by email ${email}. Error: ${err}`);
  }
}

export async function findUserById(id: number) {
  try {
    const res = await db.query(`SELECT id,email,first_name,last_name,is_admin,created_at FROM users WHERE id=$1`, [id]);
    return res.rows[0];
  } catch (err) {
    throw new Error(`Could not find user by id ${id}. Error: ${err}`);
  }
}

export async function verifyPassword(email: string, password: string) {
  try {
    const res = await db.query(`SELECT id, password_hash FROM users WHERE email=$1`, [email]);
    if (res.rowCount === 0) return false;
    const user = res.rows[0];
    const ok = await bcrypt.compare(password, user.password_hash);
    return ok ? user.id : false;
  } catch (err) {
    throw new Error(`Could not verify password. Error: ${err}`);
  }
}
