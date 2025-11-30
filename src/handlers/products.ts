import express from 'express';
import { listProducts, getProductById, createProduct } from '../models/product';
import { requireAdmin, requireAuth } from '../middleware/auth';
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const q = req.query.q as string | undefined;
    const limit = +(req.query.limit || 50);
    const offset = +(req.query.offset || 0);
    const items = await listProducts(q, limit, offset);
    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const id = +(req.params.id);
    const p = await getProductById(id);
    if (!p) return res.status(404).json({ error: 'Not found' });
    res.json(p);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/', requireAuth, requireAdmin, async (req, res) => {
  try {
    const data = req.body;
    const created = await createProduct(data);
    res.status(201).json(created);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
