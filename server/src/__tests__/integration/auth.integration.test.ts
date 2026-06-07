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

  describe('Profile /me', () => {
    let accessToken = '';

    beforeAll(async () => {
      const res = await request(app).post('/api/v1/auth/register').send({
        email: 'profiletest@example.com',
        password: 'StrongPassword123!',
        name: 'Profile Test User',
      });
      accessToken = res.body.accessToken;
    });

    it('should get current user profile', async () => {
      const res = await request(app)
        .get('/api/v1/auth/me')
        .set('Authorization', `Bearer ${accessToken}`);

      expect(res.status).toBe(200);
      expect(res.body.user.email).toBe('profiletest@example.com');
      expect(res.body.user.name).toBe('Profile Test User');
    });

    it('should update current user profile', async () => {
      const res = await request(app)
        .put('/api/v1/auth/me')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          name: 'Updated Profile Name',
          bio: 'This is a new bio',
          picture: 'http://example.com/picture.jpg',
        });

      expect(res.status).toBe(200);
      expect(res.body.user.name).toBe('Updated Profile Name');
      expect(res.body.user.bio).toBe('This is a new bio');
      expect(res.body.user.picture).toBe('http://example.com/picture.jpg');
    });

    it('should fail to update profile with invalid data', async () => {
      const res = await request(app)
        .put('/api/v1/auth/me')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          name: 'A', // too short, min length is 2
        });

      expect(res.status).toBe(400);
    });
  });
});
