import request from 'supertest';
import app from '../src/server';

describe('Auth flow', () => {
  const email = 'specuser@example.com';
  const password = 'P@ssword123';

  beforeAll(async () => {
    const db = (await import('../src/db')).default;
    await db.query('DELETE FROM users WHERE email=$1', [email]);
  });

  it('registers a user', async () => {
    const res = await request(app).post('/api/auth/register').send({ email, password, first_name: 'Spec', last_name: 'User' });
    expect(res.status).toBe(201);
    expect(res.body.token).toBeDefined();
  }, 10000);

  it('logs in the user', async () => {
    const res = await request(app).post('/api/auth/login').send({ email, password });
    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
  }, 10000);
});
