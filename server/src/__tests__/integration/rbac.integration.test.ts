import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import app from '../../app';
import { AppDataSource } from '../../utils/data-source';
import { v4 as uuidv4 } from 'uuid';
import { Role } from '../../entities/Role.entity';
import { ProjectRoleName } from '../../entities/ProjectMember.entity';

describe('RBAC Integration (Project-Based)', () => {
  let creatorToken: string;
  let outsiderToken: string;
  let testProjectId: string;

  beforeAll(async () => {
    if (!AppDataSource.isInitialized) await AppDataSource.initialize();
    await AppDataSource.synchronize(true);

    // Seed roles
    const roleRepo = AppDataSource.getRepository(Role);
    for (const name of Object.values(ProjectRoleName)) {
      await roleRepo.save(roleRepo.create({ name }));
    }

    // Register the project creator — they will be auto-assigned admin for any project they create
    const resCreator = await request(app).post('/api/v1/auth/register').send({
      email: 'creator@example.com',
      password: 'Password123!',
      name: 'Project Creator',
    });
    creatorToken = resCreator.body.accessToken;

    // Register an outsider who is NOT a member of any project
    const resOutsider = await request(app).post('/api/v1/auth/register').send({
      email: 'outsider@example.com',
      password: 'Password123!',
      name: 'Outsider',
    });
    outsiderToken = resOutsider.body.accessToken;

    // Creator creates a project → becomes admin of that project
    const projRes = await request(app)
      .post('/api/v1/projects')
      .set('Authorization', `Bearer ${creatorToken}`)
      .set('X-Idempotency-Key', uuidv4())
      .send({ name: 'Creator Project' });

    testProjectId = projRes.body.project.id;
  }, 30000);

  afterAll(async () => {
    if (AppDataSource.isInitialized) await AppDataSource.destroy();
  });

  it('Any authenticated user can create a project', async () => {
    const res = await request(app)
      .post('/api/v1/projects')
      .set('Authorization', `Bearer ${outsiderToken}`)
      .set('X-Idempotency-Key', uuidv4())
      .send({ name: 'Outsider Project' });

    expect(res.status).toBe(201);
  });

  it('Project admin (creator) can update their project', async () => {
    const res = await request(app)
      .put(`/api/v1/projects/${testProjectId}`)
      .set('Authorization', `Bearer ${creatorToken}`)
      .set('X-Idempotency-Key', uuidv4())
      .send({ name: 'Updated Creator Project' });

    expect(res.status).toBe(200);
    expect(res.body.project.name).toBe('Updated Creator Project');
  });

  it('Non-member cannot update a project they do not belong to', async () => {
    const res = await request(app)
      .put(`/api/v1/projects/${testProjectId}`)
      .set('Authorization', `Bearer ${outsiderToken}`)
      .set('X-Idempotency-Key', uuidv4())
      .send({ name: 'Hacked Name' });

    expect(res.status).toBe(403);
  });

  it('Non-member cannot delete a project they do not belong to', async () => {
    const res = await request(app)
      .delete(`/api/v1/projects/${testProjectId}`)
      .set('Authorization', `Bearer ${outsiderToken}`)
      .set('X-Idempotency-Key', uuidv4());

    expect(res.status).toBe(403);
  });

  it('Project admin (creator) can delete their project', async () => {
    const res = await request(app)
      .delete(`/api/v1/projects/${testProjectId}`)
      .set('Authorization', `Bearer ${creatorToken}`)
      .set('X-Idempotency-Key', uuidv4());

    expect(res.status).toBe(200);
  });
});
