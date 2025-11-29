import request from 'supertest';
import app from '../../src/server';
import db from '../../src/db';
import { createProduct } from '../../src/models/product';

describe('Orders API', () => {
  let token: string;
  let userId: number;
  let productId: number;
  let orderId: number;

  beforeAll(async () => {
    const res = await request(app).post('/api/auth/register').send({
      email: 'orderapi@test.com',
      password: 'password',
      first_name: 'Order',
      last_name: 'API'
    });
    token = res.body.token;
    userId = res.body.user.id;

    const p = await createProduct({ name: 'API Product', price: 100 });
    productId = p.id as number;
  });

  afterAll(async () => {
    await db.query('DELETE FROM users WHERE id=$1', [userId]);
    await db.query('DELETE FROM products WHERE id=$1', [productId]);
  });

  it('POST /api/orders should create an order', async () => {
    const res = await request(app).post('/api/orders')
      .set('Authorization', 'Bearer ' + token)
      .send({
        items: [{ product_id: productId, quantity: 1, unit_price: 100 }]
      });
    expect(res.status).toBe(201);
    orderId = res.body.id;
  });

  it('GET /api/orders should return orders', async () => {
    const res = await request(app).get('/api/orders')
      .set('Authorization', 'Bearer ' + token);
    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('POST /api/orders/:id/products should add product', async () => {
    const res = await request(app).post(`/api/orders/${orderId}/products`)
      .set('Authorization', 'Bearer ' + token)
      .send({
        product_id: productId,
        quantity: 2,
        unit_price: 100
      });
    expect(res.status).toBe(201);
  });

  it('GET /api/orders/:id/products should return products', async () => {
    const res = await request(app).get(`/api/orders/${orderId}/products`)
      .set('Authorization', 'Bearer ' + token);
    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
  });
});
