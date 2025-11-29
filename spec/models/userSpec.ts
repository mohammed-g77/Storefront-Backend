import { User, createUser, index, findUserById, verifyPassword } from '../../src/models/user';
import db from '../../src/db';

describe('User Model', () => {
  const user: User = {
    email: 'testmodel@example.com',
    password_hash: 'password123',
    first_name: 'Test',
    last_name: 'Model'
  };

  async function deleteUser(email: string) {
    await db.query('DELETE FROM users WHERE email=$1', [email]);
  }

  beforeAll(async () => {
    await deleteUser(user.email);
  });

  afterAll(async () => {
    await deleteUser(user.email);
  });

  it('should have an index method', () => {
    expect(index).toBeDefined();
  });

  it('should have a createUser method', () => {
    expect(createUser).toBeDefined();
  });

  it('create method should add a user', async () => {
    const result = await createUser(user.email, 'password123', user.first_name, user.last_name);
    expect(result.email).toEqual(user.email);
    expect(result.id).toBeDefined();
    user.id = result.id;
  });

  it('index method should return a list of users', async () => {
    const result = await index();
    expect(result.length).toBeGreaterThan(0);
  });

  it('findUserById should return the correct user', async () => {
    const result = await findUserById(user.id as number);
    expect(result.email).toEqual(user.email);
  });

  it('verifyPassword should return user id for correct password', async () => {
    const result = await verifyPassword(user.email, 'password123');
    expect(result).toEqual(user.id);
  });
});
