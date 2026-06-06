"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../../app"));
const data_source_1 = require("../../utils/data-source");
const uuid_1 = require("uuid");
const Role_entity_1 = require("../../entities/Role.entity");
const ProjectMember_entity_1 = require("../../entities/ProjectMember.entity");
const test_setup_1 = require("../../utils/test-setup");
(0, vitest_1.describe)('RBAC Integration (Project-Based)', () => {
    let creatorToken;
    let outsiderToken;
    let testProjectId;
    (0, vitest_1.beforeAll)(async () => {
        await (0, test_setup_1.ensureTestSchema)();
        if (!data_source_1.AppDataSource.isInitialized)
            await data_source_1.AppDataSource.initialize();
        await data_source_1.AppDataSource.synchronize(true);
        // Seed roles
        const roleRepo = data_source_1.AppDataSource.getRepository(Role_entity_1.Role);
        for (const name of Object.values(ProjectMember_entity_1.ProjectRoleName)) {
            await roleRepo.save(roleRepo.create({ name }));
        }
        // Register the project creator — they will be auto-assigned admin for any project they create
        const resCreator = await (0, supertest_1.default)(app_1.default).post('/api/v1/auth/register').send({
            email: 'creator@example.com',
            password: 'Password123!',
            name: 'Project Creator',
        });
        creatorToken = resCreator.body.accessToken;
        // Register an outsider who is NOT a member of any project
        const resOutsider = await (0, supertest_1.default)(app_1.default).post('/api/v1/auth/register').send({
            email: 'outsider@example.com',
            password: 'Password123!',
            name: 'Outsider',
        });
        outsiderToken = resOutsider.body.accessToken;
        // Creator creates a project → becomes admin of that project
        const projRes = await (0, supertest_1.default)(app_1.default)
            .post('/api/v1/projects')
            .set('Authorization', `Bearer ${creatorToken}`)
            .set('X-Idempotency-Key', (0, uuid_1.v4)())
            .send({ name: 'Creator Project' });
        testProjectId = projRes.body.project.id;
    }, 30000);
    (0, vitest_1.afterAll)(async () => {
        if (data_source_1.AppDataSource.isInitialized)
            await data_source_1.AppDataSource.destroy();
    });
    (0, vitest_1.it)('Any authenticated user can create a project', async () => {
        const res = await (0, supertest_1.default)(app_1.default)
            .post('/api/v1/projects')
            .set('Authorization', `Bearer ${outsiderToken}`)
            .set('X-Idempotency-Key', (0, uuid_1.v4)())
            .send({ name: 'Outsider Project' });
        (0, vitest_1.expect)(res.status).toBe(201);
    });
    (0, vitest_1.it)('Project admin (creator) can update their project', async () => {
        const res = await (0, supertest_1.default)(app_1.default)
            .put(`/api/v1/projects/${testProjectId}`)
            .set('Authorization', `Bearer ${creatorToken}`)
            .set('X-Idempotency-Key', (0, uuid_1.v4)())
            .send({ name: 'Updated Creator Project' });
        (0, vitest_1.expect)(res.status).toBe(200);
        (0, vitest_1.expect)(res.body.project.name).toBe('Updated Creator Project');
    });
    (0, vitest_1.it)('Non-member cannot update a project they do not belong to', async () => {
        const res = await (0, supertest_1.default)(app_1.default)
            .put(`/api/v1/projects/${testProjectId}`)
            .set('Authorization', `Bearer ${outsiderToken}`)
            .set('X-Idempotency-Key', (0, uuid_1.v4)())
            .send({ name: 'Hacked Name' });
        (0, vitest_1.expect)(res.status).toBe(403);
    });
    (0, vitest_1.it)('Non-member cannot delete a project they do not belong to', async () => {
        const res = await (0, supertest_1.default)(app_1.default)
            .delete(`/api/v1/projects/${testProjectId}`)
            .set('Authorization', `Bearer ${outsiderToken}`)
            .set('X-Idempotency-Key', (0, uuid_1.v4)());
        (0, vitest_1.expect)(res.status).toBe(403);
    });
    (0, vitest_1.it)('Project admin (creator) can delete their project', async () => {
        const res = await (0, supertest_1.default)(app_1.default)
            .delete(`/api/v1/projects/${testProjectId}`)
            .set('Authorization', `Bearer ${creatorToken}`)
            .set('X-Idempotency-Key', (0, uuid_1.v4)());
        (0, vitest_1.expect)(res.status).toBe(200);
    });
});
