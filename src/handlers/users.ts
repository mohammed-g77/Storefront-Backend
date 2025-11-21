import express from 'express';
import { requireAuth } from '../middleware/auth';
import { findUserById } from '../models/user';
const router = express.Router();

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

export default router;
