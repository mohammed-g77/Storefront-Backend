import request from 'supertest';
import app from '../src/server';
import jwt from 'jsonwebtoken';
const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';

describe('Products endpoints', () => {
  // create admin token (not persisted) - for test only
  const adminToken = jwt.sign({ userId: 1, is_admin: true }, JWT_SECRET, { expiresIn: '1h' });

  it('lists products (empty ok)', async () => {
    const res = await request(app).get('/api/products');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBeTrue();
  });

  it('creates a product (admin)', async () => {
    const res = await request(app).post('/api/products').set('Authorization', `Bearer ${adminToken}`).send({
      name: 'Test Product',
      description: 'A product from spec',
      price: 9.99,
      sku: 'TP-001',
      stock: 10
    });
    expect(res.status).toBe(201);
    expect(res.body.id).toBeDefined();
  }, 10000);
});
