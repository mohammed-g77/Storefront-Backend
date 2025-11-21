import fs from 'fs';
import path from 'path';
import { Client } from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const migrationsDir = path.join(__dirname, '..', 'migrations');

async function run() {
  const client = new Client({
    host: process.env.DB_HOST,
    port: +(process.env.DB_PORT || 5432),
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
  });
  await client.connect();
  try {
    const files = fs.readdirSync(migrationsDir).filter(f => f.endsWith('.sql')).sort();
    for (const file of files) {
      const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf8');
      console.log('Running', file);
      await client.query(sql);
    }
    console.log('Migrations done.');
  } catch (err) {
    console.error('Migrations failed', err);
  } finally {
    await client.end();
  }
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
