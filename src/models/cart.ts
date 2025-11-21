import db from '../db';

export async function getCartByUser(userId: number) {
  const r = await db.query('SELECT c.id as cart_id, ci.id as item_id, ci.product_id, ci.quantity FROM carts c LEFT JOIN cart_items ci ON ci.cart_id = c.id WHERE c.user_id=$1', [userId]);
  if (r.rowCount === 0) return { cart_id: null, items: [] };
  const rows = r.rows;
  const cart_id = rows[0].cart_id;
  const items = rows.filter(r=>r.item_id).map(r=>({ id: r.item_id, product_id: r.product_id, quantity: r.quantity }));
  return { cart_id, items };
}

export async function addItemToCart(userId: number, product_id: number, quantity: number) {
  // ensure cart exists
  let r = await db.query('SELECT id FROM carts WHERE user_id=$1', [userId]);
  let cartId;
  if (r.rowCount === 0) {
    const res = await db.query('INSERT INTO carts (user_id) VALUES ($1) RETURNING id', [userId]);
    cartId = res.rows[0].id;
  } else cartId = r.rows[0].id;
  // check if item exists
  r = await db.query('SELECT id, quantity FROM cart_items WHERE cart_id=$1 AND product_id=$2', [cartId, product_id]);
  if (r.rowCount === 0) {
    await db.query('INSERT INTO cart_items (cart_id, product_id, quantity) VALUES ($1,$2,$3)', [cartId, product_id, quantity]);
  } else {
    await db.query('UPDATE cart_items SET quantity = quantity + $1 WHERE id=$2', [quantity, r.rows[0].id]);
  }
  return getCartByUser(userId);
}

export async function updateCartItem(itemId: number, quantity: number) {
  await db.query('UPDATE cart_items SET quantity=$1 WHERE id=$2', [quantity, itemId]);
  return true;
}

export async function removeCartItem(itemId: number) {
  await db.query('DELETE FROM cart_items WHERE id=$1', [itemId]);
  return true;
}
