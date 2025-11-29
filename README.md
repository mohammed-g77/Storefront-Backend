# Storefront Backend

This is a backend API for a storefront application, built with Node.js, Express, TypeScript, and PostgreSQL.

## Dependencies
- Node.js
- PostgreSQL
- npm or yarn

## Installation
1. Clone the repo.
2. Run `npm install` to install dependencies.

## Database Setup
1. Make sure PostgreSQL is running.
2. Create two databases: one for development and one for testing.
   ```sql
   CREATE DATABASE storefront_dev;
   CREATE DATABASE storefront_test;
   ```

## Environment Variables
Create a `.env` file in the root directory with the following variables:

```env
POSTGRES_HOST=127.0.0.1
POSTGRES_DB=storefront_dev
POSTGRES_TEST_DB=storefront_test
POSTGRES_USER=postgres
POSTGRES_PASSWORD=password
POSTGRES_PORT=5432
ENV=dev
BCRYPT_SALT_ROUNDS=10
JWT_SECRET=your_secret_key
PORT=3000
```

For testing, you can create a `.env.test` file or rely on the `test` script which sets `ENV=test`.

## Migrations
To run migrations (UP):
```bash
npm run migrate
```

To revert migrations (DOWN):
```bash
npm run migrate:down
```

## Running the Server
```bash
npm run start
```
Or for development with watch mode:
```bash
npm run watch
```
Server runs on port 3000 by default.

## Running Tests
To run the tests (which use the test database):
```bash
npm test
```

## API Endpoints
- **Users**: `GET /api/users`, `GET /api/users/:id`, `POST /api/users`
- **Products**: `GET /api/products`, `GET /api/products/:id`, `POST /api/products`
- **Orders**: `GET /api/orders`, `GET /api/orders/:id`, `POST /api/orders`, `GET /api/orders/:id/products`, `POST /api/orders/:id/products`
- **Auth**: `POST /api/auth/register`, `POST /api/auth/login`
