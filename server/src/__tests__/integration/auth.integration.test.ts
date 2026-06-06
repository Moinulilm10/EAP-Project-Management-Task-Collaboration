import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import app from '../../app';
import { AppDataSource } from '../../utils/data-source';
import { User, AuthProvider } from '../../entities/User.entity';
import bcrypt from 'bcryptjs';
import { ensureTestSchema } from '../../utils/test-setup';

describe('Auth Integration', () => {
  beforeAll(async () => {
    await ensureTestSchema();
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }
    await AppDataSource.synchronize(true);
  }, 30000);

  afterAll(async () => {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
  });

  it('should register a new user', async () => {
    const res = await request(app).post('/api/v1/auth/register').send({
      email: 'newuser@example.com',
      password: 'StrongPassword123!',
      name: 'New User',
    });

    expect(res.status).toBe(201);
    expect(res.body.accessToken).toBeDefined();
    expect(res.body.user.email).toBe('newuser@example.com');
    expect(res.headers['set-cookie']).toBeDefined();
  });

  it('should login an existing user', async () => {
    // Seed user
    const repo = AppDataSource.getRepository(User);
    await repo.save(
      repo.create({
        email: 'loginuser@example.com',
        passwordHash: await bcrypt.hash('StrongPassword123!', 10),
        name: 'Login User',
        provider: AuthProvider.CREDENTIALS,
      })
    );

    const res = await request(app).post('/api/v1/auth/login').send({
      email: 'loginuser@example.com',
      password: 'StrongPassword123!',
    });

    expect(res.status).toBe(200);
    expect(res.body.accessToken).toBeDefined();
  });
});
