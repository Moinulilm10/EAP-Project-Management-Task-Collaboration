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
const bcryptjs_1 = __importDefault(require("bcryptjs"));
(0, vitest_1.describe)('Auth Integration', () => {
    (0, vitest_1.beforeAll)(async () => {
        if (!data_source_1.AppDataSource.isInitialized) {
            await data_source_1.AppDataSource.initialize();
        }
        await data_source_1.AppDataSource.synchronize(true);
    }, 30000);
    (0, vitest_1.afterAll)(async () => {
        if (data_source_1.AppDataSource.isInitialized) {
            await data_source_1.AppDataSource.destroy();
        }
    });
    (0, vitest_1.it)('should register a new user', async () => {
        const res = await (0, supertest_1.default)(app_1.default).post('/api/v1/auth/register').send({
            email: 'newuser@example.com',
            password: 'StrongPassword123!',
            name: 'New User',
        });
        (0, vitest_1.expect)(res.status).toBe(201);
        (0, vitest_1.expect)(res.body.accessToken).toBeDefined();
        (0, vitest_1.expect)(res.body.user.email).toBe('newuser@example.com');
        (0, vitest_1.expect)(res.headers['set-cookie']).toBeDefined();
    });
    (0, vitest_1.it)('should login an existing user', async () => {
        // Seed user
        const repo = data_source_1.AppDataSource.getRepository(User_entity_1.User);
        await repo.save(repo.create({
            email: 'loginuser@example.com',
            passwordHash: await bcryptjs_1.default.hash('StrongPassword123!', 10),
            name: 'Login User',
            provider: User_entity_1.AuthProvider.CREDENTIALS,
        }));
        const res = await (0, supertest_1.default)(app_1.default).post('/api/v1/auth/login').send({
            email: 'loginuser@example.com',
            password: 'StrongPassword123!',
        });
        (0, vitest_1.expect)(res.status).toBe(200);
        (0, vitest_1.expect)(res.body.accessToken).toBeDefined();
    });
});
