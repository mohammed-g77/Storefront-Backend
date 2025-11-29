import express from 'express';
import { requireAuth } from '../middleware/auth';
import { findUserById, index, createUser } from '../models/user';
import jwt from 'jsonwebtoken';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';

router.get('/', requireAuth, async (req, res) => {
  try {
    const users = await index();
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/:id', requireAuth, async (req, res) => {
  try {
    const id = +(req.params.id);
    // allow only owner or admin
    if (req.user.userId !== id && !req.user.is_admin) return res.status(403).json({ error: 'Forbidden' });
    const u = await findUserById(id);
    if (!u) return res.status(404).json({ error: 'Not found' });
    res.json(u);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { email, password, first_name, last_name } = req.body;
    const user = await createUser(email, password, first_name, last_name);
    const token = jwt.sign({ userId: user.id, is_admin: user.is_admin }, JWT_SECRET, { expiresIn: '2h' });
    res.status(201).json({ user, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
