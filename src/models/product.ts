import db from '../db';

export type Product = {
  id?: number;
  name: string;
  description?: string;
  price: number;
  sku?: string;
  stock?: number;
  category_id?: number;
  created_at?: string;
};

export async function createProduct(p: Product) {
  const res = await db.query(
    `INSERT INTO products (name, description, price, sku, stock, category_id) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
    [p.name, p.description, p.price, p.sku, p.stock || 0, p.category_id || null]
  );
  return res.rows[0];
}

export async function listProducts(q?: string, limit = 50, offset = 0) {
  let sql = 'SELECT id,name,description,price,stock,sku,created_at FROM products';
  const params: any[] = [];
  if (q) {
    sql += ' WHERE name ILIKE $1 OR description ILIKE $1';
    params.push('%' + q + '%');
  }
  sql += ' ORDER BY created_at DESC LIMIT $' + (params.length + 1) + ' OFFSET $' + (params.length + 2);
  params.push(limit, offset);
  const r = await db.query(sql, params);
  return r.rows;
}

export async function getProductById(id: number) {
  const r = await db.query('SELECT * FROM products WHERE id=$1', [id]);
  return r.rows[0];
}

export async function updateProduct(id: number, p: Partial<Product>) {
  const fields: string[] = [];
  const vals: any[] = [];
  let idx = 1;
  for (const k of Object.keys(p)) {
    fields.push(`${k} = $${idx++}`);
    // @ts-ignore
    vals.push((p as any)[k]);
  }
  vals.push(id);
  const sql = `UPDATE products SET ${fields.join(',')}, created_at = created_at WHERE id=$${idx} RETURNING *`;
  const r = await db.query(sql, vals);
  return r.rows[0];
}

export async function deleteProduct(id: number) {
  await db.query('DELETE FROM products WHERE id=$1', [id]);
  return true;
}
