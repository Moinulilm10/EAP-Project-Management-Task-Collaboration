import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import app from '../../app';
import { AppDataSource } from '../../utils/data-source';
import { ensureTestSchema } from '../../utils/test-setup';

describe('Profile Integration Tests', () => {
  let userToken: string;
  const userEmail = 'profiletest@example.com';
  const userName = 'Profile Test User';

  beforeAll(async () => {
    await ensureTestSchema();
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }
    await AppDataSource.synchronize(true);

    // Register a test user
    const res = await request(app).post('/api/v1/auth/register').send({
      email: userEmail,
      password: 'StrongPassword123!',
      name: userName,
    });
    userToken = res.body.accessToken;
  }, 30000);

  afterAll(async () => {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
  });

  describe('GET /api/v1/auth/me', () => {
    it('should successfully fetch the current user profile', async () => {
      const res = await request(app)
        .get('/api/v1/auth/me')
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.status).toBe(200);
      expect(res.body.user).toBeDefined();
      expect(res.body.user.email).toBe(userEmail);
      expect(res.body.user.name).toBe(userName);
      expect(res.body.user.bio).toBeNull();
      expect(res.body.user.picture).toBeNull();
    });

    it('should return 401 when authorization header is missing', async () => {
      const res = await request(app).get('/api/v1/auth/me');
      expect(res.status).toBe(401);
      expect(res.body.error).toBe('Access denied. No token provided.');
    });

    it('should return 401 when token is invalid', async () => {
      const res = await request(app)
        .get('/api/v1/auth/me')
        .set('Authorization', 'Bearer invalidtokenhere');
      expect(res.status).toBe(401);
      expect(res.body.error).toBe('Invalid or expired access token.');
    });
  });

  describe('PUT /api/v1/auth/me', () => {
    it('should successfully update user name, picture, and bio', async () => {
      const res = await request(app)
        .put('/api/v1/auth/me')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          name: 'Jane Doe',
          picture: 'https://supabase-avatar-url.com/123.jpg',
          bio: 'Software engineer from the future',
        });

      expect(res.status).toBe(200);
      expect(res.body.user.name).toBe('Jane Doe');
      expect(res.body.user.picture).toBe('https://supabase-avatar-url.com/123.jpg');
      expect(res.body.user.bio).toBe('Software engineer from the future');

      // Verify DB persists it by making a GET request
      const getRes = await request(app)
        .get('/api/v1/auth/me')
        .set('Authorization', `Bearer ${userToken}`);
      expect(getRes.body.user.name).toBe('Jane Doe');
      expect(getRes.body.user.bio).toBe('Software engineer from the future');
    });

    it('should sanitize HTML inputs (XSS prevention) in name and bio', async () => {
      const res = await request(app)
        .put('/api/v1/auth/me')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          name: '<script>alert("hacked")</script>Secure Name',
          bio: '<b>Bold Bio</b> with <script>console.log("XSS")</script> clean text',
        });

      expect(res.status).toBe(200);
      // The schema sanitization strips out html tags & script blocks
      expect(res.body.user.name).toBe('Secure Name');
      expect(res.body.user.bio).toBe('Bold Bio with  clean text');
    });

    it('should return 400 when name is less than 2 characters after sanitization', async () => {
      const res = await request(app)
        .put('/api/v1/auth/me')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          name: '   a   ', // length 1 after trim
        });

      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Validation failed');
      expect(res.body.details[0].field).toBe('name');
    });

    it('should return 400 when name is longer than 100 characters', async () => {
      const res = await request(app)
        .put('/api/v1/auth/me')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          name: 'a'.repeat(101),
        });

      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Validation failed');
      expect(res.body.details[0].field).toBe('name');
    });

    it('should return 400 when bio is longer than 1000 characters', async () => {
      const res = await request(app)
        .put('/api/v1/auth/me')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          bio: 'a'.repeat(1001),
        });

      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Validation failed');
      expect(res.body.details[0].field).toBe('bio');
    });

    it('should return 400 when picture is longer than 1000 characters', async () => {
      const res = await request(app)
        .put('/api/v1/auth/me')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          picture: 'a'.repeat(1001),
        });

      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Validation failed');
      expect(res.body.details[0].field).toBe('picture');
    });

    it('should allow omitting optional fields', async () => {
      // Send only name
      const res = await request(app)
        .put('/api/v1/auth/me')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          name: 'Only Name Update',
        });

      expect(res.status).toBe(200);
      expect(res.body.user.name).toBe('Only Name Update');
      // Picture and bio should remain their previous values
      expect(res.body.user.bio).toBe('Bold Bio with  clean text');
    });

    it('should allow setting bio to null or empty string', async () => {
      const res = await request(app)
        .put('/api/v1/auth/me')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          bio: null,
        });

      expect(res.status).toBe(200);
      expect(res.body.user.bio).toBeNull();
    });

    it('should return 401 when updating profile without a token', async () => {
      const res = await request(app)
        .put('/api/v1/auth/me')
        .send({
          name: 'Unauthenticated Update',
        });

      expect(res.status).toBe(401);
    });
  });
});
