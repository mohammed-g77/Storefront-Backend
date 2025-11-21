# Storefront Backend (Full Ready Project)

## Quick start (recommended: Docker)
1. `.env` edit if needed.
2. Start Postgres with Docker:
   ```
   docker-compose up -d
   ```
3. Install dependencies:
   ```
   yarn
   ```
4. Run migrations:
   ```
   yarn migrate
   ```
5. Start in dev (watch) mode:
   ```
   yarn watch
   ```
6. API available at `http://localhost:3000`.

## If you prefer no Docker
- Start a local Postgres and ensure env values in `.env` match.

## Migrations
Migrations run via `ts-node ./scripts/runMigrations.ts` which executes SQL files in `migrations/` in order.

## Tests
Run:
```
yarn test
```
Tests use Jasmine and expect a running test database if they execute DB operations. You can adapt tests to use a test DB by editing env vars.

