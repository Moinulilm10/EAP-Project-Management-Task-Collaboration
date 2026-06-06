import { describe, it, expect, vi, beforeEach } from 'vitest';
import { projectService } from '../../services/project.service';
import { AppDataSource } from '../../utils/data-source';
import { ProjectStatus } from '../../entities/Project.entity';
import { ProjectRoleName } from '../../entities/ProjectMember.entity';

// Mock dependencies
vi.mock('../../utils/data-source', () => ({
  AppDataSource: {
    getRepository: vi.fn(),
    manager: {
      transaction: vi.fn(),
    },
  },
}));

describe('projectService', () => {
  const mockProjectRepo = {
    findOne: vi.fn(),
    createQueryBuilder: vi.fn(),
    save: vi.fn(),
  };

  const mockMemberRepo = {
    findOne: vi.fn(),
    count: vi.fn(),
    save: vi.fn(),
  };

  const mockManager = {
    create: vi.fn(),
    save: vi.fn(),
    findOneBy: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (AppDataSource.getRepository as any).mockImplementation((entity: any) => {
      if (entity.name === 'Project') return mockProjectRepo;
      if (entity.name === 'ProjectMember') return mockMemberRepo;
    });
    // Mock transaction to immediately execute the callback with mockManager
    (AppDataSource.manager.transaction as any).mockImplementation((cb: any) => cb(mockManager));
  });

  describe('create', () => {
    it('should create a project and set the creator as Admin', async () => {
      const savedProj = { id: 'proj-1', name: 'Test Proj', ownerId: 'user-1' };
      const adminRole = { id: 'role-admin-uuid', name: ProjectRoleName.ADMIN };

      mockManager.create.mockImplementation((entity, data) => data);
      mockManager.save.mockImplementation(async (data) => {
        if (data.name === 'Test Proj') return savedProj;
        return data;
      });
      mockManager.findOneBy.mockResolvedValue(adminRole);

      const data = {
        name: 'Test Proj',
        description: 'Test Desc',
        deadline: '2026-12-31',
        status: ProjectStatus.ACTIVE,
        ownerId: 'user-1',
      };

      const result = await projectService.create(data);

      expect(mockManager.create).toHaveBeenCalledWith(expect.any(Function), expect.objectContaining({
        name: data.name,
        description: data.description,
        ownerId: data.ownerId,
      }));
      expect(mockManager.findOneBy).toHaveBeenCalledWith(expect.any(Function), { name: ProjectRoleName.ADMIN });
      expect(result).toEqual(savedProj);
    });
  });

  describe('findById', () => {
    it('should return project if found', async () => {
      const project = { id: 'proj-1', name: 'Test Proj' };
      mockProjectRepo.findOne.mockResolvedValue(project);

      const result = await projectService.findById('proj-1');
      expect(result).toEqual(project);
    });

    it('should throw 404 if not found', async () => {
      mockProjectRepo.findOne.mockResolvedValue(null);
      await expect(projectService.findById('proj-1')).rejects.toEqual({
        status: 404,
        message: 'Project not found.',
      });
    });
  });

  describe('update', () => {
    it('should update project if updated by project admin', async () => {
      const project = { id: 'proj-1', name: 'Test Proj' };
      const membership = { role: { name: ProjectRoleName.ADMIN } };

      mockProjectRepo.findOne.mockResolvedValue(project);
      mockMemberRepo.findOne.mockResolvedValue(membership);
      mockProjectRepo.save.mockImplementation(async (p) => p);

      const result = await projectService.update('proj-1', { name: 'New Name' }, 'user-admin-1');
      expect(result.name).toBe('New Name');
    });

    it('should throw 403 if user is not project admin', async () => {
      const project = { id: 'proj-1', name: 'Test Proj' };
      const membership = { role: { name: ProjectRoleName.TEAM_MEMBER } };

      mockProjectRepo.findOne.mockResolvedValue(project);
      mockMemberRepo.findOne.mockResolvedValue(membership);

      await expect(projectService.update('proj-1', { name: 'New Name' }, 'user-member-1')).rejects.toEqual({
        status: 403,
        message: 'Project update requires project admin membership.',
      });
    });
  });

  describe('delete', () => {
    it('should delete project if deleted by project admin', async () => {
      const project = { id: 'proj-1', name: 'Test Proj', deletedAt: null };
      const membership = { role: { name: ProjectRoleName.ADMIN } };

      mockProjectRepo.findOne.mockResolvedValue(project);
      mockMemberRepo.findOne.mockResolvedValue(membership);
      mockProjectRepo.save.mockImplementation(async (p) => p);

      await expect(projectService.delete('proj-1', 'user-admin-1')).resolves.not.toThrow();
    });

    it('should throw 403 if user is not project admin', async () => {
      const project = { id: 'proj-1', name: 'Test Proj', deletedAt: null };
      const membership = { role: { name: ProjectRoleName.TEAM_MEMBER } };

      mockProjectRepo.findOne.mockResolvedValue(project);
      mockMemberRepo.findOne.mockResolvedValue(membership);

      await expect(projectService.delete('proj-1', 'user-member-1')).rejects.toEqual({
        status: 403,
        message: 'Project deletion requires project admin membership.',
      });
    });
  });
});
