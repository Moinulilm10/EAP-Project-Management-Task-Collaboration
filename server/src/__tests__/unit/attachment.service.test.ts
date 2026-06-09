import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AttachmentService } from '../../../src/services/attachment.service';
import { Attachment } from '../../../src/entities/Attachment.entity';
import { StorageService } from '../../../src/services/storage.service';
import { AppDataSource } from '../../../src/utils/data-source';
import { Repository } from 'typeorm';

// Mock dependencies
vi.mock('../../../src/services/storage.service', () => ({
  StorageService: {
    uploadFile: vi.fn(),
    deleteFile: vi.fn(),
  },
}));

vi.mock('../../../src/utils/data-source', () => ({
  AppDataSource: {
    getRepository: vi.fn(),
  },
}));

describe('AttachmentService', () => {
  let attachmentService: AttachmentService;
  let mockRepo: Partial<Repository<Attachment>>;

  beforeEach(() => {
    vi.clearAllMocks();

    mockRepo = {
      create: vi.fn(),
      save: vi.fn(),
      find: vi.fn(),
      findOne: vi.fn(),
      remove: vi.fn(),
    };

    (AppDataSource.getRepository as any).mockReturnValue(mockRepo as any);
    attachmentService = new AttachmentService();
  });

  describe('uploadAttachment', () => {
    it('should create and save an attachment', async () => {
      const mockFileBuffer = Buffer.from('test');
      const mockUrl = 'https://example.com/attachments/projects/project-1/test.pdf';
      const mockUserId = 'user-1';
      const mockProjectId = 'project-1';

      const savedAttachment = {
        id: 'attach-1',
        fileName: 'test.pdf',
        fileSize: 1024,
        fileType: 'application/pdf',
        fileUrl: mockUrl,
        projectId: mockProjectId,
        taskId: null,
        uploadedById: mockUserId,
      };

      (StorageService.uploadFile as any).mockResolvedValue({ url: mockUrl, path: 'projects/project-1/test.pdf' });
      (mockRepo.create as any).mockReturnValue(savedAttachment);
      (mockRepo.save as any).mockResolvedValue(savedAttachment);

      const result = await attachmentService.uploadAttachment({
        fileBuffer: mockFileBuffer,
        fileName: 'test.pdf',
        mimeType: 'application/pdf',
        fileSize: 1024,
        userId: mockUserId,
        projectId: mockProjectId,
      });

      expect(mockRepo.create).toHaveBeenCalledWith({
        fileName: 'test.pdf',
        fileSize: 1024,
        fileType: 'application/pdf',
        fileUrl: mockUrl,
        projectId: mockProjectId,
        taskId: null,
        teamId: null,
        uploadedById: mockUserId,
      });
      expect(mockRepo.save).toHaveBeenCalledWith(savedAttachment);
      expect(result).toEqual(savedAttachment);
    });
  });

  describe('getAttachmentsByProject', () => {
    it('should return attachments for a project', async () => {
      const mockAttachments = [{ id: '1' }, { id: '2' }];
      (mockRepo.find as any).mockResolvedValue(mockAttachments);

      const result = await attachmentService.getAttachmentsByProject('project-1');

      expect(mockRepo.find).toHaveBeenCalledWith({
        where: { projectId: 'project-1' },
        relations: { uploadedBy: true },
        order: { createdAt: 'DESC' },
      });
      expect(result).toEqual(mockAttachments);
    });
  });

  describe('getAttachmentsByTask', () => {
    it('should return attachments for a task', async () => {
      const mockAttachments = [{ id: '3' }];
      (mockRepo.find as any).mockResolvedValue(mockAttachments);

      const result = await attachmentService.getAttachmentsByTask('task-1');

      expect(mockRepo.find).toHaveBeenCalledWith({
        where: { taskId: 'task-1' },
        relations: { uploadedBy: true },
        order: { createdAt: 'DESC' },
      });
      expect(result).toEqual(mockAttachments);
    });
  });

  describe('getAttachmentsByTeam', () => {
    it('should return attachments for a team', async () => {
      const mockAttachments = [{ id: '4' }];
      (mockRepo.find as any).mockResolvedValue(mockAttachments);

      const result = await attachmentService.getAttachmentsByTeam('team-1');

      expect(mockRepo.find).toHaveBeenCalledWith({
        where: { teamId: 'team-1' },
        relations: { uploadedBy: true },
        order: { createdAt: 'DESC' },
      });
      expect(result).toEqual(mockAttachments);
    });
  });

  describe('deleteAttachment', () => {
    it('should delete an attachment successfully', async () => {
      const mockAttachment = {
        id: 'attach-1',
        fileUrl: 'https://example.com/attachments/projects/project-1/test.pdf',
        projectId: 'project-1',
        taskId: null,
      };
      
      (mockRepo.findOne as any).mockResolvedValue(mockAttachment);
      (mockRepo.remove as any).mockResolvedValue(mockAttachment);
      (StorageService.deleteFile as any).mockResolvedValue(true);

      await attachmentService.deleteAttachment('attach-1', 'user-1');

      expect(mockRepo.findOne).toHaveBeenCalledWith({
        where: { id: 'attach-1' },
      });
      expect(StorageService.deleteFile).toHaveBeenCalledWith('projects/project-1/test.pdf');
      expect(mockRepo.remove).toHaveBeenCalledWith(mockAttachment);
    });

    it('should throw an error if attachment is not found', async () => {
      (mockRepo.findOne as any).mockResolvedValue(null);

      await expect(attachmentService.deleteAttachment('attach-1', 'user-1'))
        .rejects.toThrow('Attachment not found');
    });
  });
});
