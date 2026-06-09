import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import app from '../../app';
import { AppDataSource } from '../../utils/data-source';
import { v4 as uuidv4 } from 'uuid';
import { Role } from '../../entities/Role.entity';
import { ProjectRoleName } from '../../entities/ProjectMember.entity';
import { ensureTestSchema } from '../../utils/test-setup';

describe('Task Module Integration', () => {
  let userToken: string;
  let outsiderToken: string;
  let createdProjectId: string;
  let createdTaskId: string;
  let userId: string;
  let outsiderId: string;

  beforeAll(async () => {
    await ensureTestSchema();
    if (!AppDataSource.isInitialized) await AppDataSource.initialize();
    await AppDataSource.synchronize(true);

    // Seed roles
    const roleRepo = AppDataSource.getRepository(Role);
    for (const name of Object.values(ProjectRoleName)) {
      await roleRepo.save(roleRepo.create({ name }));
    }

    // Register User 1 (Project Creator)
    const resUser = await request(app).post('/api/v1/auth/register').send({
      email: 'taskcreator@example.com',
      password: 'Password123!',
      name: 'Task Creator',
    });
    userToken = resUser.body.accessToken;
    userId = resUser.body.user.id;

    // Register User 2 (Outsider)
    const resOutsider = await request(app).post('/api/v1/auth/register').send({
      email: 'taskoutsider@example.com',
      password: 'Password123!',
      name: 'Outsider',
    });
    outsiderToken = resOutsider.body.accessToken;
    outsiderId = resOutsider.body.user.id;

    // Create a project to hold tasks
    const projRes = await request(app)
      .post('/api/v1/projects')
      .set('Authorization', `Bearer ${userToken}`)
      .set('X-Idempotency-Key', uuidv4())
      .send({
        name: 'Task Integration Project',
      });
    createdProjectId = projRes.body.project.id;
  }, 30000);

  afterAll(async () => {
    if (AppDataSource.isInitialized) await AppDataSource.destroy();
  });

  describe('POST /api/v1/tasks', () => {
    it('should successfully create a new task in the project', async () => {
      const res = await request(app)
        .post('/api/v1/tasks')
        .set('Authorization', `Bearer ${userToken}`)
        .set('X-Idempotency-Key', uuidv4())
        .send({
          title: 'Initial Task',
          projectId: createdProjectId,
        });

      expect(res.status).toBe(201);
      expect(res.body.task).toHaveProperty('id');
      expect(res.body.task.title).toBe('Initial Task');
      createdTaskId = res.body.task.id;
    });

    it('should fail to create a duplicate task title in the same project', async () => {
      const res = await request(app)
        .post('/api/v1/tasks')
        .set('Authorization', `Bearer ${userToken}`)
        .set('X-Idempotency-Key', uuidv4())
        .send({
          title: 'Initial Task',
          projectId: createdProjectId,
        });

      expect(res.status).toBe(400);
      expect(res.body.error).toBe('This task already exists in the project.');
    });

    it('should fail if deadline is in the past', async () => {
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 2);

      const res = await request(app)
        .post('/api/v1/tasks')
        .set('Authorization', `Bearer ${userToken}`)
        .set('X-Idempotency-Key', uuidv4())
        .send({
          title: 'Past Task',
          projectId: createdProjectId,
          dueDate: pastDate.toISOString(),
        });

      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Please select a valid deadline.');
    });
  });

  describe('PUT /api/v1/tasks/:id', () => {
    it('should update task details', async () => {
      const res = await request(app)
        .put(`/api/v1/tasks/${createdTaskId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .set('X-Idempotency-Key', uuidv4())
        .send({
          title: 'Updated Task Title',
          status: 'in_progress'
        });

      expect(res.status).toBe(200);
      expect(res.body.task.title).toBe('Updated Task Title');
      expect(res.body.task.status).toBe('in_progress');
    });

    it('should fail when reassigning a completed task', async () => {
      // First mark the task as done and assigned to the creator
      const res1 = await request(app)
        .put(`/api/v1/tasks/${createdTaskId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .set('X-Idempotency-Key', uuidv4())
        .send({
          status: 'done',
          assigneeId: userId
        });
      expect(res1.status).toBe(200);

      // Now attempt to reassign
      const res = await request(app)
        .put(`/api/v1/tasks/${createdTaskId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .set('X-Idempotency-Key', uuidv4())
        .send({
          assigneeId: outsiderId
        });
        
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Completed tasks cannot be reassigned.');
    });

    it('should fail when a non-owner tries to update the task', async () => {
      const res = await request(app)
        .put(`/api/v1/tasks/${createdTaskId}`)
        .set('Authorization', `Bearer ${outsiderToken}`)
        .set('X-Idempotency-Key', uuidv4())
        .send({
          title: 'Hacked Task Title'
        });

      expect(res.status).toBe(403);
      expect(res.body.message).toBe('Only the task owner can edit or change the status of this task.');
    });
  });

  describe('GET /api/v1/tasks', () => {
    it('should retrieve tasks for the user with correct filters', async () => {
      const res = await request(app)
        .get('/api/v1/tasks?status=done')
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.status).toBe(200);
      expect(res.body.tasks).toBeInstanceOf(Array);
      expect(res.body.tasks.length).toBeGreaterThan(0);
      expect(res.body.tasks[0].id).toBe(createdTaskId);
      expect(res.body.tasks[0].status).toBe('done');
    });

    it('should support pagination', async () => {
      const res = await request(app)
        .get('/api/v1/tasks?page=1&limit=1')
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.status).toBe(200);
      expect(res.body.tasks).toBeInstanceOf(Array);
      expect(res.body.tasks.length).toBeLessThanOrEqual(1);
      expect(res.body).toHaveProperty('total');
    });

    it('should support sorting by priority_desc', async () => {
      const res = await request(app)
        .get('/api/v1/tasks?sortBy=priority_desc')
        .set('Authorization', `Bearer ${userToken}`);

      if (res.status !== 200) {
        console.error('Priority Sort Error Body:', res.body);
      }

      expect(res.status).toBe(200);
      expect(res.body.tasks).toBeInstanceOf(Array);
    });

    it('should support filtering by deadlineStatus', async () => {
      const res = await request(app)
        .get('/api/v1/tasks?deadlineStatus=upcoming')
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.status).toBe(200);
      expect(res.body.tasks).toBeInstanceOf(Array);
    });

    it('should support filtering by assigneeId', async () => {
      const res = await request(app)
        .get(`/api/v1/tasks?assigneeId=${userId}`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.status).toBe(200);
      expect(res.body.tasks).toBeInstanceOf(Array);
    });

    it('should not return tasks from unauthorized projects', async () => {
      const res = await request(app)
        .get('/api/v1/tasks')
        .set('Authorization', `Bearer ${outsiderToken}`);

      expect(res.status).toBe(200);
      expect(res.body.tasks).toHaveLength(0);
    });
  });

  describe('DELETE /api/v1/tasks/:id', () => {
    it('should fail when a non-owner tries to delete the task', async () => {
      const res = await request(app)
        .delete(`/api/v1/tasks/${createdTaskId}`)
        .set('Authorization', `Bearer ${outsiderToken}`)
        .set('X-Idempotency-Key', uuidv4());

      expect(res.status).toBe(403);
      expect(res.body.message).toBe('Only the task owner can delete this task.');
    });

    it('should successfully delete a task', async () => {
      const res = await request(app)
        .delete(`/api/v1/tasks/${createdTaskId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .set('X-Idempotency-Key', uuidv4());

      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Task deleted successfully.');

      // Verify deletion
      const checkRes = await request(app)
        .get(`/api/v1/tasks/${createdTaskId}`)
        .set('Authorization', `Bearer ${userToken}`);
      
      expect(checkRes.status).toBe(404);
    });
  });
});
