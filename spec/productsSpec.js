"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const server_1 = __importDefault(require("../src/server"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';
describe('Products endpoints', () => {
    // create admin token (not persisted) - for test only
    const adminToken = jsonwebtoken_1.default.sign({ userId: 1, is_admin: true }, JWT_SECRET, { expiresIn: '1h' });
    it('lists products (empty ok)', async () => {
        const res = await (0, supertest_1.default)(server_1.default).get('/api/products');
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBeTrue();
    });
    it('creates a product (admin)', async () => {
        const res = await (0, supertest_1.default)(server_1.default).post('/api/products').set('Authorization', `Bearer ${adminToken}`).send({
            name: 'Test Product',
            description: 'A product from spec',
            price: 9.99,
            sku: 'TP-001',
            stock: 10
        });
        expect(res.status).toBe(201);
        expect(res.body.id).toBeDefined();
    }, 10000);
});
