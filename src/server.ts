import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './handlers/auth';
import productsRoutes from './handlers/products';
import usersRoutes from './handlers/users';
import ordersRoutes from './handlers/orders';
import cartRoutes from './handlers/cart';

dotenv.config();
const app = express();
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/cart', cartRoutes);

app.get('/', (req, res) => {
  res.send('Welcome to the Storefront API!');
});

const port = +(process.env.PORT || 3000);
app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});

export default app;
