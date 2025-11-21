import express from 'express';
import { createUser, findUserByEmail, verifyPassword, findUserById } from '../models/user';
import jwt from 'jsonwebtoken';
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';
const JWT_EXPIRES_IN = '2h';

router.post('/register', async (req, res) => {
  try {
    const { email, password, first_name, last_name } = req.body;
    const existing = await findUserByEmail(email);
    if (existing) return res.status(409).json({ error: 'Email already used' });

    const user = await createUser(email, password, first_name, last_name);
    const token = jwt.sign({ userId: user.id, is_admin: user.is_admin }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
    res.status(201).json({ user, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const valid = await verifyPassword(email, password);
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' });
    const user = await findUserById(valid as number);
    const token = jwt.sign({ userId: user.id, is_admin: user.is_admin }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
    res.json({ user, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
