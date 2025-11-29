import request from 'supertest';
import app from '../../src/server';
import db from '../../src/db';

describe('Users API', () => {
  let token: string;
  let userId: number;

  beforeAll(async () => {
    // Create a user via model or auth endpoint to get token
    const res = await request(app).post('/api/auth/register').send({
      email: 'apiuser@test.com',
      password: 'password',
      first_name: 'API',
      last_name: 'User'
    });
    token = res.body.token;
    userId = res.body.user.id;
  });

  afterAll(async () => {
    await db.query('DELETE FROM users WHERE id=$1', [userId]);
  });

  it('GET /api/users should require auth', async () => {
    const res = await request(app).get('/api/users');
    expect(res.status).toBe(401);
  });

  it('GET /api/users should return list (if authorized)', async () => {
    const res = await request(app).get('/api/users').set('Authorization', 'Bearer ' + token);
    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('GET /api/users/:id should return user details', async () => {
    const res = await request(app).get('/api/users/' + userId).set('Authorization', 'Bearer ' + token);
    expect(res.status).toBe(200);
    expect(res.body.email).toEqual('apiuser@test.com');
  });

  it('POST /api/users should create a user', async () => {
    const res = await request(app).post('/api/users').send({
      email: 'newuser@test.com',
      password: 'password',
      first_name: 'New',
      last_name: 'User'
    });
    expect(res.status).toBe(201);
    await db.query('DELETE FROM users WHERE id=$1', [res.body.user.id]);
  });
});
