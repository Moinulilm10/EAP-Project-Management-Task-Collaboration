"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../../app"));
const data_source_1 = require("../../utils/data-source");
const Role_entity_1 = require("../../entities/Role.entity");
const ProjectMember_entity_1 = require("../../entities/ProjectMember.entity");
(0, vitest_1.describe)('Idempotency Integration', () => {
    let accessToken;
    (0, vitest_1.beforeAll)(async () => {
        if (!data_source_1.AppDataSource.isInitialized) {
            await data_source_1.AppDataSource.initialize();
        }
        await data_source_1.AppDataSource.synchronize(true);
        // Seed roles
        const roleRepo = data_source_1.AppDataSource.getRepository(Role_entity_1.Role);
        for (const name of Object.values(ProjectMember_entity_1.ProjectRoleName)) {
            await roleRepo.save(roleRepo.create({ name }));
        }
        // Any registered user can create a project (no global role needed)
        const res = await (0, supertest_1.default)(app_1.default).post('/api/v1/auth/register').send({
            email: 'idempotency-user@example.com',
            password: 'StrongPassword123!',
            name: 'Idempotency User',
        });
        accessToken = res.body.accessToken;
    }, 30000);
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
