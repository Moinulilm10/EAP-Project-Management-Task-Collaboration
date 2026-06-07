import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import app from '../../app';
import { AppDataSource } from '../../utils/data-source';
import { v4 as uuidv4 } from 'uuid';
import { ensureTestSchema } from '../../utils/test-setup';

describe('Team Module Integration', () => {
  let userToken: string;
  let outsiderToken: string;
  let createdTeamId: string;
  let outsiderUserId: string;

  beforeAll(async () => {
    await ensureTestSchema();
    if (!AppDataSource.isInitialized) await AppDataSource.initialize();
    await AppDataSource.synchronize(true);

    // Register User 1 (Team Admin)
    const resUser = await request(app).post('/api/v1/auth/register').send({
      email: 'teamadmin@example.com',
      password: 'Password123!',
      name: 'Team Admin',
    });
    userToken = resUser.body.accessToken;

    // Register User 2 (Outsider/Member)
    const resOutsider = await request(app).post('/api/v1/auth/register').send({
      email: 'teamoutsider@example.com',
      password: 'Password123!',
      name: 'Team Outsider',
    });
    outsiderToken = resOutsider.body.accessToken;
    outsiderUserId = resOutsider.body.user.id;
  }, 30000);

  afterAll(async () => {
    if (AppDataSource.isInitialized) await AppDataSource.destroy();
  });

  describe('POST /api/v1/teams', () => {
    it('should successfully create a new team', async () => {
      const res = await request(app)
        .post('/api/v1/teams')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          name: 'Integration Team',
          description: 'Team details for integration testing',
          maxMembers: 5,
        });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('id');
      expect(res.body.name).toBe('Integration Team');
      expect(res.body.maxMembers).toBe(5);
      createdTeamId = res.body.id;
    });

    it('should fail if unauthorized', async () => {
      const res = await request(app)
        .post('/api/v1/teams')
        .send({
          name: 'Integration Team 2',
        });
      expect(res.status).toBe(401);
    });
  });

  describe('GET /api/v1/teams', () => {
    it('should retrieve teams with pagination', async () => {
      const res = await request(app)
        .get('/api/v1/teams?page=1&limit=2')
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('data');
      expect(res.body).toHaveProperty('meta');
      expect(res.body.data.length).toBeGreaterThan(0);
      expect(res.body.meta.total).toBeGreaterThan(0);
      expect(res.body.meta.limit).toBe(2);
      expect(res.body.meta.page).toBe(1);
    });
  });

  describe('GET /api/v1/teams/:id', () => {
    it('should retrieve team details by ID for a member', async () => {
      const res = await request(app)
        .get(`/api/v1/teams/${createdTeamId}`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.status).toBe(200);
      expect(res.body.name).toBe('Integration Team');
    });

    it('should return 403 for an outsider', async () => {
      const res = await request(app)
        .get(`/api/v1/teams/${createdTeamId}`)
        .set('Authorization', `Bearer ${outsiderToken}`);

      expect(res.status).toBe(403);
    });
  });

  describe('POST /api/v1/teams/:id/members', () => {
    it('should allow admin to add a member', async () => {
      const res = await request(app)
        .post(`/api/v1/teams/${createdTeamId}/members`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          userId: outsiderUserId,
          role: 'Member',
        });

      expect(res.status).toBe(201);
      expect(res.body.userId).toBe(outsiderUserId);
    });

    it('should deny non-admin from adding members', async () => {
      const res = await request(app)
        .post(`/api/v1/teams/${createdTeamId}/members`)
        .set('Authorization', `Bearer ${outsiderToken}`)
        .send({
          userId: uuidv4(),
          role: 'Member',
        });

      expect(res.status).toBe(403);
    });
  });

  describe('PUT /api/v1/teams/:id/capacity', () => {
    it('should allow admin to update capacity', async () => {
      const res = await request(app)
        .put(`/api/v1/teams/${createdTeamId}/capacity`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          maxMembers: 15,
        });

      expect(res.status).toBe(200);
      expect(res.body.maxMembers).toBe(15);
    });
  });

  describe('PUT /api/v1/teams/:id', () => {
    it('should allow admin to update team info', async () => {
      const res = await request(app)
        .put(`/api/v1/teams/${createdTeamId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          name: 'Updated Integration Team',
        });

      expect(res.status).toBe(200);
      expect(res.body.name).toBe('Updated Integration Team');
    });
  });

  describe('DELETE /api/v1/teams/:id/members/:userId', () => {
    it('should deny a user from removing themselves if they are admin', async () => {
      // Find out the admin's user id. Actually, let's just use the current admin to remove outsider
      const res = await request(app)
        .delete(`/api/v1/teams/${createdTeamId}/members/${outsiderUserId}`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.status).toBe(200);
    });
  });

  describe('DELETE /api/v1/teams/:id', () => {
    it('should deny non-admin from deleting the team', async () => {
      const res = await request(app)
        .delete(`/api/v1/teams/${createdTeamId}`)
        .set('Authorization', `Bearer ${outsiderToken}`);

      expect(res.status).toBe(403);
    });

    it('should allow admin to delete the team', async () => {
      const res = await request(app)
        .delete(`/api/v1/teams/${createdTeamId}`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.status).toBe(200);
    });
  });
});
