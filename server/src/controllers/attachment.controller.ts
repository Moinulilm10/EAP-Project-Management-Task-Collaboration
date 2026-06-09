import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import { AttachmentService } from '../services/attachment.service';

const attachmentService = new AttachmentService();

export const attachmentController = {
  async upload(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Not authenticated.' });
        return;
      }

      if (!req.file) {
        res.status(400).json({ error: 'No file uploaded.' });
        return;
      }

      const { projectId, taskId, teamId } = req.body;

      if (!projectId && !taskId && !teamId) {
        res.status(400).json({ error: 'Must provide projectId, taskId, or teamId.' });
        return;
      }

      const attachment = await attachmentService.uploadAttachment({
        fileBuffer: req.file.buffer,
        fileName: req.file.originalname,
        mimeType: req.file.mimetype,
        fileSize: req.file.size,
        userId: req.user.id,
        projectId,
        taskId,
        teamId,
      });

      res.status(201).json({ attachment });
    } catch (error: any) {
      res.status(error.status || 500).json({ error: error.message || 'File upload failed.' });
    }
  },

  async getByProject(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { projectId } = req.params;
      const attachments = await attachmentService.getAttachmentsByProject(projectId as string);
      res.status(200).json({ attachments });
    } catch (error: any) {
      res.status(error.status || 500).json({ error: error.message || 'Failed to fetch attachments.' });
    }
  },

  async getByTask(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { taskId } = req.params;
      const attachments = await attachmentService.getAttachmentsByTask(taskId as string);
      res.status(200).json({ attachments });
    } catch (error: any) {
      res.status(error.status || 500).json({ error: error.message || 'Failed to fetch attachments.' });
    }
  },

  async getByTeam(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { teamId } = req.params;
      const attachments = await attachmentService.getAttachmentsByTeam(teamId as string);
      res.status(200).json({ attachments });
    } catch (error: any) {
      res.status(error.status || 500).json({ error: error.message || 'Failed to fetch attachments.' });
    }
  },

  async delete(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Not authenticated.' });
        return;
      }

      const { id } = req.params;
      await attachmentService.deleteAttachment(id as string, req.user.id);
      
      res.status(200).json({ message: 'Attachment deleted successfully.' });
    } catch (error: any) {
      res.status(error.status || 500).json({ error: error.message || 'Failed to delete attachment.' });
    }
  },
};
