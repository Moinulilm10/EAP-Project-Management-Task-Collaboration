import { apiClient } from '../utils/apiClient';

export interface Attachment {
  id: string;
  fileName: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
  projectId?: string;
  taskId?: string;
  teamId?: string;
  uploadedById: string;
  createdAt: string;
  uploadedBy: {
    id: string;
    name: string;
    email: string;
    picture?: string;
  };
}

export const attachmentService = {
  async upload(file: File, params: { projectId?: string; taskId?: string; teamId?: string }): Promise<Attachment> {
    const formData = new FormData();
    formData.append('file', file);
    if (params.projectId) formData.append('projectId', params.projectId);
    if (params.taskId) formData.append('taskId', params.taskId);
    if (params.teamId) formData.append('teamId', params.teamId);

    const response = await apiClient.post<{ attachment: Attachment }>(
      '/attachments/upload',
      formData
    );
    return response.attachment;
  },

  async getByProject(projectId: string): Promise<Attachment[]> {
    const response = await apiClient.get<{ attachments: Attachment[] }>(`/attachments/project/${projectId}`);
    return response.attachments;
  },

  async getByTask(taskId: string): Promise<Attachment[]> {
    const response = await apiClient.get<{ attachments: Attachment[] }>(`/attachments/task/${taskId}`);
    return response.attachments;
  },

  async getByTeam(teamId: string): Promise<Attachment[]> {
    const response = await apiClient.get<{ attachments: Attachment[] }>(`/attachments/team/${teamId}`);
    return response.attachments;
  },

  async delete(attachmentId: string): Promise<void> {
    await apiClient.delete(`/attachments/${attachmentId}`);
  },
};
