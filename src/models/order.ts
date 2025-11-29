import db from '../db';

export type Order = {
  id?: number;
  user_id: number;
  status: string;
  total: number;
  shipping_address_id?: number;
  billing_address_id?: number;
  created_at?: string;
  updated_at?: string;
};

export async function createOrder(userId: number, items: {product_id:number, quantity:number, unit_price:number}[], shipping_address_id?: number, billing_address_id?: number) {
  // start transaction
  const client = await (db as any).pool.connect();
  try {
    await client.query('BEGIN');
    const res = await client.query('INSERT INTO orders (user_id, total, shipping_address_id, billing_address_id) VALUES ($1,$2,$3,$4) RETURNING *',
      [userId, 0, shipping_address_id || null, billing_address_id || null]);
    const order = res.rows[0];
    let total = 0;
    for (const it of items) {
      const sub = it.unit_price * it.quantity;
      total += sub;
      await client.query('INSERT INTO order_products (order_id, product_id, unit_price, quantity) VALUES ($1,$2,$3,$4)', [order.id, it.product_id, it.unit_price, it.quantity]);
      await client.query('UPDATE products SET stock = stock - $1 WHERE id=$2', [it.quantity, it.product_id]);
    }
    await client.query('UPDATE orders SET total=$1 WHERE id=$2', [total, order.id]);
    await client.query('COMMIT');
    return (await client.query('SELECT * FROM orders WHERE id=$1', [order.id])).rows[0];
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

export async function getOrdersForUser(userId: number) {
  const r = await db.query('SELECT * FROM orders WHERE user_id=$1 ORDER BY created_at DESC', [userId]);
  return r.rows;
}

export async function getOrderById(id: number) {
  const r = await db.query('SELECT * FROM orders WHERE id=$1', [id]);
  return r.rows[0];
}

// Order Products methods
export async function addProductToOrder(orderId: number, productId: number, quantity: number, unitPrice: number) {
  const r = await db.query('INSERT INTO order_products (order_id, product_id, quantity, unit_price) VALUES ($1,$2,$3,$4) RETURNING *', [orderId, productId, quantity, unitPrice]);
  return r.rows[0];
}

export async function getOrderProducts(orderId: number) {
  const r = await db.query('SELECT * FROM order_products WHERE order_id=$1', [orderId]);
  return r.rows;
}
