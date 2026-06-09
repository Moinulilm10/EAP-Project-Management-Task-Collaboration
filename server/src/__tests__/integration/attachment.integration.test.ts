import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest';
import request from 'supertest';
import app from '../../app';
import { AppDataSource } from '../../utils/data-source';
import { v4 as uuidv4 } from 'uuid';
import { ensureTestSchema } from '../../utils/test-setup';
import { StorageService } from '../../services/storage.service';
import { Project } from '../../entities/Project.entity';
import { User } from '../../entities/User.entity';
import { Role } from '../../entities/Role.entity';
import { ProjectRoleName } from '../../entities/ProjectMember.entity';

describe('Attachment Module Integration', () => {
  let userToken: string;
  let createdProjectId: string;
  let createdTeamId: string;

  beforeAll(async () => {
    await ensureTestSchema();
    if (!AppDataSource.isInitialized) await AppDataSource.initialize();
    await AppDataSource.synchronize(true);

    // Seed roles
    const roleRepo = AppDataSource.getRepository(Role);
    for (const name of Object.values(ProjectRoleName)) {
      await roleRepo.save(roleRepo.create({ name }));
    }

    // Register User
    const resUser = await request(app).post('/api/v1/auth/register').send({
      email: 'attachment_test@example.com',
      password: 'Password123!',
      name: 'Attachment Tester',
    });
    userToken = resUser.body.accessToken;

    // Create a Project
    const resProject = await request(app)
      .post('/api/v1/projects')
      .set('Authorization', `Bearer ${userToken}`)
      .set('X-Idempotency-Key', uuidv4())
      .send({
        name: 'Attachment Project',
        description: 'Testing attachments',
        deadline: '2026-12-31T00:00:00.000Z',
      });

    if (resProject.status !== 201) {
      console.error('Failed to create project:', resProject.body);
    }
    
    createdProjectId = resProject.body.project?.id || '';

    // Create a Team
    const resTeam = await request(app)
      .post('/api/v1/teams')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        name: 'Attachment Team',
        description: 'Testing attachments for team',
      });
      
    createdTeamId = resTeam.body.id || '';

    // Mock StorageService
    vi.spyOn(StorageService, 'uploadFile').mockImplementation(async (fileBuffer, fileName, mimeType, folder) => {
      return {
        url: `https://mock.supabase.co/storage/v1/object/public/attachments/${folder}/mock-${fileName}`,
        path: `${folder}/mock-${fileName}`,
      };
    });
    vi.spyOn(StorageService, 'deleteFile').mockImplementation(async (filePath) => {
      return;
    });
  }, 30000);

  afterAll(async () => {
    vi.restoreAllMocks();
    if (AppDataSource.isInitialized) await AppDataSource.destroy();
  });

  describe('POST /api/v1/attachments/upload', () => {
    it('should successfully upload an image under 5MB', async () => {
      const mockImageBuffer = Buffer.from('mock image content');

      const res = await request(app)
        .post('/api/v1/attachments/upload')
        .set('Authorization', `Bearer ${userToken}`)
        .field('projectId', createdProjectId)
        .attach('file', mockImageBuffer, {
          filename: 'test-image.png',
          contentType: 'image/png',
        });

      expect(res.status).toBe(201);
      expect(res.body.attachment).toHaveProperty('id');
      expect(res.body.attachment.fileName).toBe('test-image.png');
      expect(res.body.attachment.fileType).toBe('image/png');
      expect(res.body.attachment.fileUrl).toContain('mock-test-image.png');
    });

    it('should reject an image over 5MB', async () => {
      // Create a 6MB buffer
      const largeBuffer = Buffer.alloc(6 * 1024 * 1024);

      const res = await request(app)
        .post('/api/v1/attachments/upload')
        .set('Authorization', `Bearer ${userToken}`)
        .field('projectId', createdProjectId)
        .attach('file', largeBuffer, {
          filename: 'large-image.png',
          contentType: 'image/png',
        });

      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Image size must not exceed 5MB.');
    });

    it('should successfully upload a PDF under 10MB', async () => {
      const mockPdfBuffer = Buffer.from('mock pdf content');

      const res = await request(app)
        .post('/api/v1/attachments/upload')
        .set('Authorization', `Bearer ${userToken}`)
        .field('projectId', createdProjectId)
        .attach('file', mockPdfBuffer, {
          filename: 'test-doc.pdf',
          contentType: 'application/pdf',
        });

      expect(res.status).toBe(201);
      expect(res.body.attachment).toHaveProperty('id');
      expect(res.body.attachment.fileType).toBe('application/pdf');
    });

    it('should reject a file without projectId or taskId', async () => {
      const mockBuffer = Buffer.from('content');

      const res = await request(app)
        .post('/api/v1/attachments/upload')
        .set('Authorization', `Bearer ${userToken}`)
        .attach('file', mockBuffer, {
          filename: 'test.png',
          contentType: 'image/png',
        });

      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Must provide projectId, taskId, or teamId.');
    });
  });

  describe('GET /api/v1/attachments', () => {
    it('should get attachments by project', async () => {
      const res = await request(app)
        .get(`/api/v1/attachments/project/${createdProjectId}`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.status).toBe(200);
      expect(res.body.attachments).toBeInstanceOf(Array);
      expect(res.body.attachments.length).toBeGreaterThanOrEqual(2); // image and pdf
      expect(res.body.attachments[0].uploadedBy).toBeDefined();
    });

    it('should get attachments by team', async () => {
      // First upload an attachment to a team
      const resUpload = await request(app)
        .post('/api/v1/attachments/upload')
        .set('Authorization', `Bearer ${userToken}`)
        .field('teamId', createdTeamId)
        .attach('file', Buffer.from('mock pdf content'), {
          filename: 'team-doc.pdf',
          contentType: 'application/pdf',
        });
      
      expect(resUpload.status).toBe(201);

      const res = await request(app)
        .get(`/api/v1/attachments/team/${createdTeamId}`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.status).toBe(200);
      expect(res.body.attachments).toBeInstanceOf(Array);
      expect(res.body.attachments.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('DELETE /api/v1/attachments/:id', () => {
    it('should delete an attachment', async () => {
      // First get all attachments
      const getRes = await request(app)
        .get(`/api/v1/attachments/project/${createdProjectId}`)
        .set('Authorization', `Bearer ${userToken}`);
      
      const attachmentId = getRes.body.attachments[0].id;

      const deleteRes = await request(app)
        .delete(`/api/v1/attachments/${attachmentId}`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(deleteRes.status).toBe(200);
      expect(deleteRes.body.message).toBe('Attachment deleted successfully.');
      expect(StorageService.deleteFile).toHaveBeenCalled();
    });
  });
});
