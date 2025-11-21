import express from 'express';
import { requireAuth } from '../middleware/auth';
import { getCartByUser, addItemToCart, updateCartItem, removeCartItem } from '../models/cart';
const router = express.Router();

router.get('/', requireAuth, async (req, res) => {
  try {
    const cart = await getCartByUser(req.user.userId);
    res.json(cart);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/items', requireAuth, async (req, res) => {
  try {
    const { product_id, quantity } = req.body;
    const cart = await addItemToCart(req.user.userId, product_id, quantity);
    res.status(201).json(cart);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/items/:itemId', requireAuth, async (req, res) => {
  try {
    const itemId = +(req.params.itemId);
    const { quantity } = req.body;
    await updateCartItem(itemId, quantity);
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/items/:itemId', requireAuth, async (req, res) => {
  try {
    const itemId = +(req.params.itemId);
    await removeCartItem(itemId);
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
