import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import app from '../../app';
import { AppDataSource } from '../../utils/data-source';
import { Role } from '../../entities/Role.entity';
import { ProjectRoleName } from '../../entities/ProjectMember.entity';

describe('Idempotency Integration', () => {
  let accessToken: string;

  beforeAll(async () => {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }
    await AppDataSource.synchronize(true);

    // Seed roles
    const roleRepo = AppDataSource.getRepository(Role);
    for (const name of Object.values(ProjectRoleName)) {
      await roleRepo.save(roleRepo.create({ name }));
    }

    // Any registered user can create a project (no global role needed)
    const res = await request(app).post('/api/v1/auth/register').send({
      email: 'idempotency-user@example.com',
      password: 'StrongPassword123!',
      name: 'Idempotency User',
    });
    accessToken = res.body.accessToken;
  }, 30000);

  afterAll(async () => {
    if (AppDataSource.isInitialized) await AppDataSource.destroy();
  });

  it('should return 400 if missing X-Idempotency-Key on POST', async () => {
    const res = await request(app)
      .post('/api/v1/projects')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ name: 'Test Project' });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Missing X-Idempotency-Key');
  });

  it('should process first request and cache second with same key', async () => {
    const key = 'test-key-123';
    const payload = { name: 'Idempotent Project' };

    const res1 = await request(app)
      .post('/api/v1/projects')
      .set('Authorization', `Bearer ${accessToken}`)
      .set('X-Idempotency-Key', key)
      .send(payload);

    expect(res1.status).toBe(201);

    const res2 = await request(app)
      .post('/api/v1/projects')
      .set('Authorization', `Bearer ${accessToken}`)
      .set('X-Idempotency-Key', key)
      .send(payload);

    expect(res2.status).toBe(201);
    expect(res2.body).toEqual(res1.body);
  });
});
