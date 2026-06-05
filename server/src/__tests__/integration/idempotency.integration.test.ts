import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import app from '../../app';
import { AppDataSource } from '../../utils/data-source';
import { User, UserRole, AuthProvider } from '../../entities/User.entity';
import { authService } from '../../services/auth.service';

describe('Idempotency Integration', () => {
  let accessToken: string;

  beforeAll(async () => {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }
    await AppDataSource.synchronize(true);

    const res = await request(app).post('/api/v1/auth/register').send({
        email: 'admin2@example.com',
        password: 'StrongPassword123!',
        name: 'Admin2'
    });
    accessToken = res.body.accessToken;
    // Upgrade to admin manually
    await AppDataSource.getRepository(User).update({ email: 'admin2@example.com' }, { role: UserRole.ADMIN });
    // Re-login to get admin token
    const loginRes = await request(app).post('/api/v1/auth/login').send({
        email: 'admin2@example.com',
        password: 'StrongPassword123!',
    });
    accessToken = loginRes.body.accessToken;
  });

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
