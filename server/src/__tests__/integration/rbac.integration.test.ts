import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import app from '../../app';
import { AppDataSource } from '../../utils/data-source';
import { User, UserRole } from '../../entities/User.entity';
import { Project } from '../../entities/Project.entity';
import { v4 as uuidv4 } from 'uuid';

describe('RBAC Integration', () => {
  let adminToken: string;
  let teamMemberToken: string;
  let testProjectId: string;

  beforeAll(async () => {
    if (!AppDataSource.isInitialized) await AppDataSource.initialize();
    await AppDataSource.synchronize(true);

    // Register Team Member
    const resTm = await request(app).post('/api/v1/auth/register').send({
      email: 'team@example.com', password: 'Password123!', name: 'Team Member'
    });
    teamMemberToken = resTm.body.accessToken;

    // Register Admin
    const resAd = await request(app).post('/api/v1/auth/register').send({
      email: 'admin@example.com', password: 'Password123!', name: 'Admin'
    });
    await AppDataSource.getRepository(User).update({ email: 'admin@example.com' }, { role: UserRole.ADMIN });
    
    const loginAd = await request(app).post('/api/v1/auth/login').send({
      email: 'admin@example.com', password: 'Password123!'
    });
    adminToken = loginAd.body.accessToken;

    // Create a project as Admin
    const projRes = await request(app)
      .post('/api/v1/projects')
      .set('Authorization', `Bearer ${adminToken}`)
      .set('X-Idempotency-Key', uuidv4())
      .send({ name: 'Admin Project' });
    
    testProjectId = projRes.body.project.id;
  });

  afterAll(async () => {
    if (AppDataSource.isInitialized) await AppDataSource.destroy();
  });

  it('Admin can create a project', async () => {
    const res = await request(app)
      .post('/api/v1/projects')
      .set('Authorization', `Bearer ${adminToken}`)
      .set('X-Idempotency-Key', uuidv4())
      .send({ name: 'Another Admin Project' });

    expect(res.status).toBe(201);
  });

  it('Team Member gets 403 when trying to create a project', async () => {
    const res = await request(app)
      .post('/api/v1/projects')
      .set('Authorization', `Bearer ${teamMemberToken}`)
      .set('X-Idempotency-Key', uuidv4())
      .send({ name: 'Team Member Project' });

    expect(res.status).toBe(403);
    expect(res.body.error).toBe('Forbidden');
  });

  it('Admin can delete a project', async () => {
    const res = await request(app)
      .delete(`/api/v1/projects/${testProjectId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .set('X-Idempotency-Key', uuidv4());

    expect(res.status).toBe(200);
  });
});
