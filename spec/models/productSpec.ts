import { Product, createProduct, listProducts, getProductById, deleteProduct } from '../../src/models/product';
import db from '../../src/db';

describe('Product Model', () => {
  const product: Product = {
    name: 'Test Product',
    price: 100,
    description: 'Test Description'
  };

  async function cleanUp() {
    await db.query('DELETE FROM products WHERE name=$1', [product.name]);
  }

  beforeAll(async () => {
    await cleanUp();
  });

  afterAll(async () => {
    await cleanUp();
  });

  it('createProduct should add a product', async () => {
    const result = await createProduct(product);
    expect(result.name).toEqual(product.name);
    expect(result.id).toBeDefined();
    product.id = result.id;
  });

  it('listProducts should return a list', async () => {
    const result = await listProducts();
    expect(result.length).toBeGreaterThan(0);
  });

  it('getProductById should return the product', async () => {
    const result = await getProductById(product.id as number);
    expect(result.name).toEqual(product.name);
  });
});
