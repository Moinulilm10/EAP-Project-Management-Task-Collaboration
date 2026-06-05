"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../../app"));
const data_source_1 = require("../../utils/data-source");
const User_entity_1 = require("../../entities/User.entity");
(0, vitest_1.describe)('Idempotency Integration', () => {
    let accessToken;
    (0, vitest_1.beforeAll)(async () => {
        if (!data_source_1.AppDataSource.isInitialized) {
            await data_source_1.AppDataSource.initialize();
        }
        await data_source_1.AppDataSource.synchronize(true);
        const res = await (0, supertest_1.default)(app_1.default).post('/api/v1/auth/register').send({
            email: 'admin2@example.com',
            password: 'StrongPassword123!',
            name: 'Admin2'
        });
        accessToken = res.body.accessToken;
        // Upgrade to admin manually
        await data_source_1.AppDataSource.getRepository(User_entity_1.User).update({ email: 'admin2@example.com' }, { role: User_entity_1.UserRole.ADMIN });
        // Re-login to get admin token
        const loginRes = await (0, supertest_1.default)(app_1.default).post('/api/v1/auth/login').send({
            email: 'admin2@example.com',
            password: 'StrongPassword123!',
        });
        accessToken = loginRes.body.accessToken;
    });
    (0, vitest_1.afterAll)(async () => {
        if (data_source_1.AppDataSource.isInitialized)
            await data_source_1.AppDataSource.destroy();
    });
    (0, vitest_1.it)('should return 400 if missing X-Idempotency-Key on POST', async () => {
        const res = await (0, supertest_1.default)(app_1.default)
            .post('/api/v1/projects')
            .set('Authorization', `Bearer ${accessToken}`)
            .send({ name: 'Test Project' });
        (0, vitest_1.expect)(res.status).toBe(400);
        (0, vitest_1.expect)(res.body.error).toBe('Missing X-Idempotency-Key');
    });
    (0, vitest_1.it)('should process first request and cache second with same key', async () => {
        const key = 'test-key-123';
        const payload = { name: 'Idempotent Project' };
        const res1 = await (0, supertest_1.default)(app_1.default)
            .post('/api/v1/projects')
            .set('Authorization', `Bearer ${accessToken}`)
            .set('X-Idempotency-Key', key)
            .send(payload);
        (0, vitest_1.expect)(res1.status).toBe(201);
        const res2 = await (0, supertest_1.default)(app_1.default)
            .post('/api/v1/projects')
            .set('Authorization', `Bearer ${accessToken}`)
            .set('X-Idempotency-Key', key)
            .send(payload);
        (0, vitest_1.expect)(res2.status).toBe(201);
        (0, vitest_1.expect)(res2.body).toEqual(res1.body);
    });
});
