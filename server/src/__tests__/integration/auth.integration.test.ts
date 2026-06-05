import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import app from '../../app';
import { AppDataSource } from '../../utils/data-source';
import { User, UserRole, AuthProvider } from '../../entities/User.entity';
import bcrypt from 'bcryptjs';

describe('Auth Integration', () => {
  beforeAll(async () => {
    // Setup in-memory SQLite for testing if needed, or rely on a test DB config
    // For this demonstration, we'll assume AppDataSource is configured for tests
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }
    await AppDataSource.synchronize(true); // Drop and recreate schema
  });

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
        role: UserRole.TEAM_MEMBER,
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
