import fs from 'fs';
import path from 'path';
import { Client } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const {
  POSTGRES_HOST,
  POSTGRES_DB,
  POSTGRES_TEST_DB,
  POSTGRES_USER,
  POSTGRES_PASSWORD,
  POSTGRES_PORT,
  ENV,
} = process.env;

const migrationsDir = path.join(__dirname, '..', 'migrations');
const downMigrationsDir = path.join(migrationsDir, 'down');

async function run() {
  const action = process.argv[2] || 'up'; // 'up' or 'down'

  const client = new Client({
    host: POSTGRES_HOST,
    port: parseInt(POSTGRES_PORT as string, 10),
    database: ENV === 'test' ? POSTGRES_TEST_DB : POSTGRES_DB,
    user: POSTGRES_USER,
    password: POSTGRES_PASSWORD,
  });

  await client.connect();

  try {
    if (action === 'down') {
      console.log('Running DOWN migrations...');
      if (fs.existsSync(downMigrationsDir)) {
        const files = fs.readdirSync(downMigrationsDir).filter(f => f.endsWith('.sql')).sort().reverse();
        for (const file of files) {
          const sql = fs.readFileSync(path.join(downMigrationsDir, file), 'utf8');
          console.log('Running', file);
          await client.query(sql);
        }
      } else {
        console.log('No down migrations found.');
      }
    } else {
      console.log('Running UP migrations...');
      const files = fs.readdirSync(migrationsDir).filter(f => f.endsWith('.sql')).sort();
      for (const file of files) {
        const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf8');
        console.log('Running', file);
        await client.query(sql);
      }
    }
    console.log('Migrations done.');
  } catch (err) {
    console.error('Migrations failed', err);
    process.exit(1);
  } finally {
    await client.end();
  }
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
