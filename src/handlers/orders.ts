import express from 'express';
import { requireAuth } from '../middleware/auth';
import { createOrder, getOrdersForUser, getOrderById } from '../models/order';
const router = express.Router();

router.post('/', requireAuth, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { items, shipping_address_id, billing_address_id } = req.body;
    const order = await createOrder(userId, items, shipping_address_id, billing_address_id);
    res.status(201).json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/', requireAuth, async (req, res) => {
  try {
    if (req.user.is_admin) {
      // admin: list all orders (simple)
      const r = await (await import('../db')).default.query('SELECT * FROM orders ORDER BY created_at DESC');
      return res.json(r.rows);
    }
    const orders = await getOrdersForUser(req.user.userId);
    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/:id', requireAuth, async (req, res) => {
  try {
    const id = +(req.params.id);
    const order = await getOrderById(id);
    if (!order) return res.status(404).json({ error: 'Not found' });
    // allow owner or admin
    if (order.user_id !== req.user.userId && !req.user.is_admin) return res.status(403).json({ error: 'Forbidden' });
    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
