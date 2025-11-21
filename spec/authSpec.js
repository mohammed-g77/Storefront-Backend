"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const server_1 = __importDefault(require("../src/server"));
describe('Auth flow', () => {
    const email = 'specuser@example.com';
    const password = 'P@ssword123';
    it('registers a user', async () => {
        const res = await (0, supertest_1.default)(server_1.default).post('/api/auth/register').send({ email, password, first_name: 'Spec', last_name: 'User' });
        expect(res.status).toBe(201);
        expect(res.body.token).toBeDefined();
    }, 10000);
    it('logs in the user', async () => {
        const res = await (0, supertest_1.default)(server_1.default).post('/api/auth/login').send({ email, password });
        expect(res.status).toBe(200);
        expect(res.body.token).toBeDefined();
    }, 10000);
});
