import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import app from '../../app';
import { AppDataSource } from '../../utils/data-source';
import { v4 as uuidv4 } from 'uuid';
import { Role } from '../../entities/Role.entity';
import { ProjectRoleName } from '../../entities/ProjectMember.entity';

describe('Project Module Integration', () => {
  let userToken: string;
  let outsiderToken: string;
  let createdProjectId: string;

  beforeAll(async () => {
    if (!AppDataSource.isInitialized) await AppDataSource.initialize();
    await AppDataSource.synchronize(true);

    // Seed roles
    const roleRepo = AppDataSource.getRepository(Role);
    for (const name of Object.values(ProjectRoleName)) {
      await roleRepo.save(roleRepo.create({ name }));
    }

    // Register User 1 (Project Creator)
    const resUser = await request(app).post('/api/v1/auth/register').send({
      email: 'creator@example.com',
      password: 'Password123!',
      name: 'Project Creator',
    });
    userToken = resUser.body.accessToken;

    // Register User 2 (Outsider)
    const resOutsider = await request(app).post('/api/v1/auth/register').send({
      email: 'outsider@example.com',
      password: 'Password123!',
      name: 'Outsider',
    });
    outsiderToken = resOutsider.body.accessToken;
  }, 30000);

  afterAll(async () => {
    if (AppDataSource.isInitialized) await AppDataSource.destroy();
  });

  describe('POST /api/v1/projects', () => {
    it('should successfully create a new project and assign creator as admin', async () => {
      const res = await request(app)
        .post('/api/v1/projects')
        .set('Authorization', `Bearer ${userToken}`)
        .set('X-Idempotency-Key', uuidv4())
        .send({
          name: 'Integration Project',
          description: 'Project details for integration testing',
          deadline: '2026-12-31T00:00:00.000Z',
        });

      expect(res.status).toBe(201);
      expect(res.body.project).toHaveProperty('id');
      expect(res.body.project.name).toBe('Integration Project');
      expect(res.body.project.ownerId).toBeDefined();
      createdProjectId = res.body.project.id;
    });

    it('should return 400 if project name is missing', async () => {
      const res = await request(app)
        .post('/api/v1/projects')
        .set('Authorization', `Bearer ${userToken}`)
        .set('X-Idempotency-Key', uuidv4())
        .send({
          description: 'Missing name',
        });

      expect(res.status).toBe(400);
    });
  });

  describe('GET /api/v1/projects', () => {
    it('should retrieve projects associated with the user', async () => {
      const res = await request(app)
        .get('/api/v1/projects')
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('projects');
      expect(res.body).toHaveProperty('total');
      expect(res.body.projects.length).toBeGreaterThan(0);
      expect(res.body.projects[0].name).toBe('Integration Project');
    });

    it('should filter projects by adminOnly correctly', async () => {
      // Creator fetches with adminOnly=true -> should get the project
      const resAdmin = await request(app)
        .get('/api/v1/projects?adminOnly=true')
        .set('Authorization', `Bearer ${userToken}`);
      expect(resAdmin.body.projects.length).toBe(1);

      // Outsider fetches with adminOnly=true -> should get 0 projects
      const resOutsider = await request(app)
        .get('/api/v1/projects?adminOnly=true')
        .set('Authorization', `Bearer ${outsiderToken}`);
      expect(resOutsider.body.projects.length).toBe(0);
    });
  });

  describe('GET /api/v1/projects/:id', () => {
    it('should retrieve project details by ID', async () => {
      const res = await request(app)
        .get(`/api/v1/projects/${createdProjectId}`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.status).toBe(200);
      expect(res.body.project.name).toBe('Integration Project');
    });

    it('should return 404 for a non-existent project ID', async () => {
      const res = await request(app)
        .get(`/api/v1/projects/${uuidv4()}`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.status).toBe(404);
    });
  });

  describe('PUT /api/v1/projects/:id', () => {
    it('should allow the project admin to update the project properties', async () => {
      const res = await request(app)
        .put(`/api/v1/projects/${createdProjectId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .set('X-Idempotency-Key', uuidv4())
        .send({
          name: 'Updated Integration Project',
          description: 'Updated details description',
        });

      expect(res.status).toBe(200);
      expect(res.body.project.name).toBe('Updated Integration Project');
    });

    it('should deny non-admin users from updating the project', async () => {
      const res = await request(app)
        .put(`/api/v1/projects/${createdProjectId}`)
        .set('Authorization', `Bearer ${outsiderToken}`)
        .set('X-Idempotency-Key', uuidv4())
        .send({
          name: 'Hacked Project Name',
        });

      expect(res.status).toBe(403);
    });
  });

  describe('DELETE /api/v1/projects/:id', () => {
    it('should deny non-admin users from deleting the project', async () => {
      const res = await request(app)
        .delete(`/api/v1/projects/${createdProjectId}`)
        .set('Authorization', `Bearer ${outsiderToken}`)
        .set('X-Idempotency-Key', uuidv4());

      expect(res.status).toBe(403);
    });

    it('should allow the project admin to delete the project', async () => {
      const res = await request(app)
        .delete(`/api/v1/projects/${createdProjectId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .set('X-Idempotency-Key', uuidv4());

      expect(res.status).toBe(200);
    });
  });
});
