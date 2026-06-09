import { describe, it, expect, vi, beforeEach } from 'vitest';
import { attachmentService } from '../../services/attachment.service';

vi.mock('next-auth/react', () => ({
  getSession: vi.fn(() => Promise.resolve({ accessToken: 'mock-token' })),
  signOut: vi.fn(),
}));

describe('AttachmentService (Frontend)', () => {
  beforeEach(() => {
    process.env.NEXT_PUBLIC_API_URL = 'http://localhost:5000/api/v1';
    global.fetch = vi.fn();
    // Mock localStorage for auth token
    Storage.prototype.getItem = vi.fn(() => 'mock-token');
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('upload', () => {
    it('should upload a file and return the attachment data', async () => {
      const mockFile = new File(['test content'], 'test.pdf', { type: 'application/pdf' });
      const mockResponse = { attachment: { id: '1', fileName: 'test.pdf' } };
      
      (global.fetch as any).mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await attachmentService.upload(mockFile, { projectId: 'project-1' });

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/attachments/upload'),
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            Authorization: 'Bearer mock-token',
          }),
          body: expect.any(FormData),
        })
      );
      expect(result).toEqual(mockResponse.attachment);
    });

    it('should throw an error on upload failure', async () => {
      const mockFile = new File(['test content'], 'test.pdf', { type: 'application/pdf' });
      
      (global.fetch as any).mockResolvedValue({
        ok: false,
        json: async () => ({ error: 'Upload failed' }),
      });

      await expect(attachmentService.upload(mockFile, { projectId: 'project-1' }))
        .rejects.toThrow('Upload failed');
    });
  });

  describe('getByProject', () => {
    it('should fetch attachments by project ID', async () => {
      const mockAttachments = [{ id: '1', fileName: 'test.pdf' }];
      (global.fetch as any).mockResolvedValue({
        ok: true,
        json: async () => ({ attachments: mockAttachments }),
      });

      const result = await attachmentService.getByProject('project-1');

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/attachments/project/project-1'),
        expect.any(Object)
      );
      expect(result).toEqual(mockAttachments);
    });
  });

  describe('getByTask', () => {
    it('should fetch attachments by task ID', async () => {
      const mockAttachments = [{ id: '2', fileName: 'task-test.pdf' }];
      (global.fetch as any).mockResolvedValue({
        ok: true,
        json: async () => ({ attachments: mockAttachments }),
      });

      const result = await attachmentService.getByTask('task-1');

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/attachments/task/task-1'),
        expect.any(Object)
      );
      expect(result).toEqual(mockAttachments);
    });
  });

  describe('delete', () => {
    it('should delete an attachment', async () => {
      (global.fetch as any).mockResolvedValue({
        ok: true,
        json: async () => ({}),
      });

      await attachmentService.delete('attach-1');

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/attachments/attach-1'),
        expect.objectContaining({
          method: 'DELETE',
        })
      );
    });
  });
});
