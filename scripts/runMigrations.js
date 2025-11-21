"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const pg_1 = require("pg");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const migrationsDir = path_1.default.join(__dirname, '..', 'migrations');
async function run() {
    const client = new pg_1.Client({
        host: process.env.DB_HOST,
        port: +(process.env.DB_PORT || 5432),
        database: process.env.DB_NAME,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD
    });
    await client.connect();
    try {
        const files = fs_1.default.readdirSync(migrationsDir).filter(f => f.endsWith('.sql')).sort();
        for (const file of files) {
            const sql = fs_1.default.readFileSync(path_1.default.join(migrationsDir, file), 'utf8');
            console.log('Running', file);
            await client.query(sql);
        }
        console.log('Migrations done.');
    }
    catch (err) {
        console.error('Migrations failed', err);
    }
    finally {
        await client.end();
    }
}
run().catch(err => {
    console.error(err);
    process.exit(1);
});
