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
(0, vitest_1.describe)('Project Module Integration', () => {
    let userToken;
    let outsiderToken;
    let createdProjectId;
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
        // Register User 1 (Project Creator)
        const resUser = await (0, supertest_1.default)(app_1.default).post('/api/v1/auth/register').send({
            email: 'creator@example.com',
            password: 'Password123!',
            name: 'Project Creator',
        });
        userToken = resUser.body.accessToken;
        // Register User 2 (Outsider)
        const resOutsider = await (0, supertest_1.default)(app_1.default).post('/api/v1/auth/register').send({
            email: 'outsider@example.com',
            password: 'Password123!',
            name: 'Outsider',
        });
        outsiderToken = resOutsider.body.accessToken;
    }, 30000);
    (0, vitest_1.afterAll)(async () => {
        if (data_source_1.AppDataSource.isInitialized)
            await data_source_1.AppDataSource.destroy();
    });
    (0, vitest_1.describe)('POST /api/v1/projects', () => {
        (0, vitest_1.it)('should successfully create a new project and assign creator as admin', async () => {
            const res = await (0, supertest_1.default)(app_1.default)
                .post('/api/v1/projects')
                .set('Authorization', `Bearer ${userToken}`)
                .set('X-Idempotency-Key', (0, uuid_1.v4)())
                .send({
                name: 'Integration Project',
                description: 'Project details for integration testing',
                deadline: '2026-12-31T00:00:00.000Z',
            });
            (0, vitest_1.expect)(res.status).toBe(201);
            (0, vitest_1.expect)(res.body.project).toHaveProperty('id');
            (0, vitest_1.expect)(res.body.project.name).toBe('Integration Project');
            (0, vitest_1.expect)(res.body.project.ownerId).toBeDefined();
            createdProjectId = res.body.project.id;
        });
        (0, vitest_1.it)('should return 400 if project name is missing', async () => {
            const res = await (0, supertest_1.default)(app_1.default)
                .post('/api/v1/projects')
                .set('Authorization', `Bearer ${userToken}`)
                .set('X-Idempotency-Key', (0, uuid_1.v4)())
                .send({
                description: 'Missing name',
            });
            (0, vitest_1.expect)(res.status).toBe(400);
        });
    });
    (0, vitest_1.describe)('GET /api/v1/projects', () => {
        (0, vitest_1.it)('should retrieve projects associated with the user', async () => {
            const res = await (0, supertest_1.default)(app_1.default)
                .get('/api/v1/projects')
                .set('Authorization', `Bearer ${userToken}`);
            (0, vitest_1.expect)(res.status).toBe(200);
            (0, vitest_1.expect)(res.body).toHaveProperty('projects');
            (0, vitest_1.expect)(res.body).toHaveProperty('total');
            (0, vitest_1.expect)(res.body.projects.length).toBeGreaterThan(0);
            (0, vitest_1.expect)(res.body.projects[0].name).toBe('Integration Project');
        });
        (0, vitest_1.it)('should filter projects by adminOnly correctly', async () => {
            // Creator fetches with adminOnly=true -> should get the project
            const resAdmin = await (0, supertest_1.default)(app_1.default)
                .get('/api/v1/projects?adminOnly=true')
                .set('Authorization', `Bearer ${userToken}`);
            (0, vitest_1.expect)(resAdmin.body.projects.length).toBe(1);
            // Outsider fetches with adminOnly=true -> should get 0 projects
            const resOutsider = await (0, supertest_1.default)(app_1.default)
                .get('/api/v1/projects?adminOnly=true')
                .set('Authorization', `Bearer ${outsiderToken}`);
            (0, vitest_1.expect)(resOutsider.body.projects.length).toBe(0);
        });
    });
    (0, vitest_1.describe)('GET /api/v1/projects/:id', () => {
        (0, vitest_1.it)('should retrieve project details by ID', async () => {
            const res = await (0, supertest_1.default)(app_1.default)
                .get(`/api/v1/projects/${createdProjectId}`)
                .set('Authorization', `Bearer ${userToken}`);
            (0, vitest_1.expect)(res.status).toBe(200);
            (0, vitest_1.expect)(res.body.project.name).toBe('Integration Project');
        });
        (0, vitest_1.it)('should return 404 for a non-existent project ID', async () => {
            const res = await (0, supertest_1.default)(app_1.default)
                .get(`/api/v1/projects/${(0, uuid_1.v4)()}`)
                .set('Authorization', `Bearer ${userToken}`);
            (0, vitest_1.expect)(res.status).toBe(404);
        });
    });
    (0, vitest_1.describe)('PUT /api/v1/projects/:id', () => {
        (0, vitest_1.it)('should allow the project admin to update the project properties', async () => {
            const res = await (0, supertest_1.default)(app_1.default)
                .put(`/api/v1/projects/${createdProjectId}`)
                .set('Authorization', `Bearer ${userToken}`)
                .set('X-Idempotency-Key', (0, uuid_1.v4)())
                .send({
                name: 'Updated Integration Project',
                description: 'Updated details description',
            });
            (0, vitest_1.expect)(res.status).toBe(200);
            (0, vitest_1.expect)(res.body.project.name).toBe('Updated Integration Project');
        });
        (0, vitest_1.it)('should deny non-admin users from updating the project', async () => {
            const res = await (0, supertest_1.default)(app_1.default)
                .put(`/api/v1/projects/${createdProjectId}`)
                .set('Authorization', `Bearer ${outsiderToken}`)
                .set('X-Idempotency-Key', (0, uuid_1.v4)())
                .send({
                name: 'Hacked Project Name',
            });
            (0, vitest_1.expect)(res.status).toBe(403);
        });
    });
    (0, vitest_1.describe)('DELETE /api/v1/projects/:id', () => {
        (0, vitest_1.it)('should deny non-admin users from deleting the project', async () => {
            const res = await (0, supertest_1.default)(app_1.default)
                .delete(`/api/v1/projects/${createdProjectId}`)
                .set('Authorization', `Bearer ${outsiderToken}`)
                .set('X-Idempotency-Key', (0, uuid_1.v4)());
            (0, vitest_1.expect)(res.status).toBe(403);
        });
        (0, vitest_1.it)('should allow the project admin to delete the project', async () => {
            const res = await (0, supertest_1.default)(app_1.default)
                .delete(`/api/v1/projects/${createdProjectId}`)
                .set('Authorization', `Bearer ${userToken}`)
                .set('X-Idempotency-Key', (0, uuid_1.v4)());
            (0, vitest_1.expect)(res.status).toBe(200);
        });
    });
});
