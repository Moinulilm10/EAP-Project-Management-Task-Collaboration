import { AppDataSource } from '../utils/data-source';
import { Attachment } from '../entities/Attachment.entity';
import { Project } from '../entities/Project.entity';
import { Task } from '../entities/Task.entity';
import { User } from '../entities/User.entity';
import { StorageService } from './storage.service';

export class AttachmentService {
  private attachmentRepo = AppDataSource.getRepository(Attachment);
  private projectRepo = AppDataSource.getRepository(Project);
  private taskRepo = AppDataSource.getRepository(Task);

  async uploadAttachment(params: {
    fileBuffer: Buffer;
    fileName: string;
    mimeType: string;
    fileSize: number;
    userId: string;
    projectId?: string;
    taskId?: string;
    teamId?: string;
  }): Promise<Attachment> {
    const { fileBuffer, fileName, mimeType, fileSize, userId, projectId, taskId, teamId } = params;

    if (!projectId && !taskId && !teamId) {
      throw new Error('Attachment must be linked to a project, task, or team');
    }

    let folder = 'general';
    if (projectId) folder = `projects/${projectId}`;
    else if (taskId) folder = `tasks/${taskId}`;
    else if (teamId) folder = `teams/${teamId}`;

    // Upload to Supabase Storage
    const { url, path } = await StorageService.uploadFile(fileBuffer, fileName, mimeType, folder);

    // Save to Database
    const attachment = this.attachmentRepo.create({
      fileName,
      fileUrl: url,
      fileType: mimeType,
      fileSize,
      projectId: projectId || null,
      taskId: taskId || null,
      teamId: teamId || null,
      uploadedById: userId,
    });

    return await this.attachmentRepo.save(attachment);
  }

  async getAttachmentsByProject(projectId: string): Promise<Attachment[]> {
    return await this.attachmentRepo.find({
      where: { projectId },
      relations: { uploadedBy: true },
      order: { createdAt: 'DESC' },
    });
  }

  async getAttachmentsByTask(taskId: string): Promise<Attachment[]> {
    return await this.attachmentRepo.find({
      where: { taskId },
      relations: { uploadedBy: true },
      order: { createdAt: 'DESC' },
    });
  }

  async getAttachmentsByTeam(teamId: string): Promise<Attachment[]> {
    return await this.attachmentRepo.find({
      where: { teamId },
      relations: { uploadedBy: true },
      order: { createdAt: 'DESC' },
    });
  }

  async deleteAttachment(attachmentId: string, userId: string): Promise<void> {
    const attachment = await this.attachmentRepo.findOne({
      where: { id: attachmentId },
    });

    if (!attachment) {
      throw new Error('Attachment not found');
    }

    // TODO: Verify if user has permission to delete (uploader or admin)

    // Delete from Supabase Storage using the path extracted from the URL
    // URL format is typically: .../storage/v1/object/public/attachments/folder/filename
    // The path after 'attachments/' is what we need. 
    // Wait, the url itself has the full path. We can just parse it or store the path in DB.
    // Let's store the full URL and extract the path.
    const urlParts = attachment.fileUrl.split('/attachments/');
    if (urlParts.length > 1) {
      const path = urlParts[1];
      await StorageService.deleteFile(path);
    }

    await this.attachmentRepo.remove(attachment);
  }
}
