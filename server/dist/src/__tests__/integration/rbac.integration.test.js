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
const uuid_1 = require("uuid");
(0, vitest_1.describe)('RBAC Integration', () => {
    let adminToken;
    let teamMemberToken;
    let testProjectId;
    (0, vitest_1.beforeAll)(async () => {
        if (!data_source_1.AppDataSource.isInitialized)
            await data_source_1.AppDataSource.initialize();
        await data_source_1.AppDataSource.synchronize(true);
        // Register Team Member
        const resTm = await (0, supertest_1.default)(app_1.default).post('/api/v1/auth/register').send({
            email: 'team@example.com', password: 'Password123!', name: 'Team Member'
        });
        teamMemberToken = resTm.body.accessToken;
        // Register Admin
        const resAd = await (0, supertest_1.default)(app_1.default).post('/api/v1/auth/register').send({
            email: 'admin@example.com', password: 'Password123!', name: 'Admin'
        });
        await data_source_1.AppDataSource.getRepository(User_entity_1.User).update({ email: 'admin@example.com' }, { role: User_entity_1.UserRole.ADMIN });
        const loginAd = await (0, supertest_1.default)(app_1.default).post('/api/v1/auth/login').send({
            email: 'admin@example.com', password: 'Password123!'
        });
        adminToken = loginAd.body.accessToken;
        // Create a project as Admin
        const projRes = await (0, supertest_1.default)(app_1.default)
            .post('/api/v1/projects')
            .set('Authorization', `Bearer ${adminToken}`)
            .set('X-Idempotency-Key', (0, uuid_1.v4)())
            .send({ name: 'Admin Project' });
        testProjectId = projRes.body.project.id;
    });
    (0, vitest_1.afterAll)(async () => {
        if (data_source_1.AppDataSource.isInitialized)
            await data_source_1.AppDataSource.destroy();
    });
    (0, vitest_1.it)('Admin can create a project', async () => {
        const res = await (0, supertest_1.default)(app_1.default)
            .post('/api/v1/projects')
            .set('Authorization', `Bearer ${adminToken}`)
            .set('X-Idempotency-Key', (0, uuid_1.v4)())
            .send({ name: 'Another Admin Project' });
        (0, vitest_1.expect)(res.status).toBe(201);
    });
    (0, vitest_1.it)('Team Member gets 403 when trying to create a project', async () => {
        const res = await (0, supertest_1.default)(app_1.default)
            .post('/api/v1/projects')
            .set('Authorization', `Bearer ${teamMemberToken}`)
            .set('X-Idempotency-Key', (0, uuid_1.v4)())
            .send({ name: 'Team Member Project' });
        (0, vitest_1.expect)(res.status).toBe(403);
        (0, vitest_1.expect)(res.body.error).toBe('Forbidden');
    });
    (0, vitest_1.it)('Admin can delete a project', async () => {
        const res = await (0, supertest_1.default)(app_1.default)
            .delete(`/api/v1/projects/${testProjectId}`)
            .set('Authorization', `Bearer ${adminToken}`)
            .set('X-Idempotency-Key', (0, uuid_1.v4)());
        (0, vitest_1.expect)(res.status).toBe(200);
    });
});
