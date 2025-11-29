import { createOrder, getOrdersForUser, addProductToOrder, getOrderProducts } from '../../src/models/order';
import { createUser } from '../../src/models/user';
import { createProduct } from '../../src/models/product';
import db from '../../src/db';

describe('Order Model', () => {
  let userId: number;
  let productId: number;
  let orderId: number;

  beforeAll(async () => {
    const u = await createUser('ordermodel@test.com', 'pass', 'Order', 'User');
    userId = u.id as number;
    const p = await createProduct({ name: 'Order Product', price: 50 });
    productId = p.id as number;
  });

  afterAll(async () => {
    if (userId) await db.query('DELETE FROM users WHERE id=$1', [userId]);
    if (productId) await db.query('DELETE FROM products WHERE id=$1', [productId]);
    if (orderId) await db.query('DELETE FROM orders WHERE id=$1', [orderId]);
  });

  it('createOrder should create an order', async () => {
    const order = await createOrder(userId, [{ product_id: productId, quantity: 1, unit_price: 50 }]);
    expect(order.id).toBeDefined();
    expect(order.user_id).toEqual(userId);
    orderId = order.id as number;
  });

  it('getOrdersForUser should return orders', async () => {
    const orders = await getOrdersForUser(userId);
    expect(orders.length).toBeGreaterThan(0);
  });

  it('addProductToOrder should add a product', async () => {
    const added = await addProductToOrder(orderId, productId, 2, 50);
    expect(added.quantity).toEqual(2);
  });

  it('getOrderProducts should return products', async () => {
    const products = await getOrderProducts(orderId);
    expect(products.length).toBeGreaterThan(0);
  });
});
