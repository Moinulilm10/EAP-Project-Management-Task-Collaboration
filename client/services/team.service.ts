import { apiClient } from "../utils/apiClient";

export interface TeamMember {
  id: string;
  userId: string;
  role: "Admin" | "Member";
  user?: {
    id: string;
    name: string;
    email: string;
  };
}

export interface TeamProject {
  id: string;
  projectId: string;
  project?: {
    id: string;
    name: string;
    status: string;
  };
}

export interface TeamTask {
  id: string;
  taskId: string;
  task?: {
    id: string;
    title: string;
    status: string;
  };
}

export interface Team {
  id: string;
  name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
  maxMembers: number;
  members: TeamMember[];
  projectTeams: TeamProject[];
  taskTeams: TeamTask[];
}

export interface TeamCreateDTO {
  name: string;
  description?: string;
  maxMembers?: number;
}

export const teamService = {
  async getAll(): Promise<Team[]> {
    const data = await apiClient.get<Team[]>("/teams");
    return data as any;
  },

  async getById(id: string): Promise<Team> {
    const data = await apiClient.get<Team>(`/teams/${id}`);
    return data as any;
  },

  async create(payload: TeamCreateDTO): Promise<Team> {
    const data = await apiClient.post<Team>("/teams", payload);
    return data as any;
  },

  async addMember(teamId: string, userId: string, role: string): Promise<void> {
    await apiClient.post(`/teams/${teamId}/members`, { userId, role });
  },

  async assignProject(teamId: string, projectId: string): Promise<void> {
    await apiClient.post(`/teams/${teamId}/projects`, { projectId });
  },

  async assignTask(teamId: string, taskId: string): Promise<void> {
    await apiClient.post(`/teams/${teamId}/tasks`, { taskId });
  },

  async updateCapacity(teamId: string, maxMembers: number): Promise<Team> {
    const data = await apiClient.put<Team>(`/teams/${teamId}/capacity`, { maxMembers });
    return data as any;
  },

  async updateTeam(teamId: string, payload: { name?: string; description?: string }): Promise<Team> {
    const data = await apiClient.put<Team>(`/teams/${teamId}`, payload);
    return data as any;
  },

  async deleteTeam(teamId: string): Promise<void> {
    await apiClient.delete(`/teams/${teamId}`);
  },

  async removeMember(teamId: string, userId: string): Promise<void> {
    await apiClient.delete(`/teams/${teamId}/members/${userId}`);
  },
};
