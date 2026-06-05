import { apiClient } from "../utils/apiClient";

export type ProjectStatus = "active" | "completed" | "on_hold";

export interface Project {
  id: string;
  name: string;
  description: string | null;
  deadline: string | null;
  status: ProjectStatus;
  progress: number;
  owner: {
    id: string;
    name: string;
    email: string;
  };
  memberCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectSummary extends Project {}

export interface ProjectCreateDTO {
  name: string;
  description?: string | null;
  deadline?: string | null;
  status?: ProjectStatus;
}

export interface ProjectUpdateDTO {
  name?: string;
  description?: string | null;
  deadline?: string | null;
  status?: ProjectStatus;
  progress?: number;
}

export interface ProjectPaginationResponse {
  projects: ProjectSummary[];
  total: number;
}

export interface ProjectQueryParams {
  status?: ProjectStatus;
  search?: string;
  page?: number;
  limit?: number;
}

const buildQueryString = (params: ProjectQueryParams) => {
  const query = new URLSearchParams();

  if (params.status) query.set("status", params.status);
  if (params.search) query.set("search", params.search);
  if (params.page) query.set("page", String(params.page));
  if (params.limit) query.set("limit", String(params.limit));

  return query.toString() ? `?${query.toString()}` : "";
};

export const projectService = {
  getAll: (params: ProjectQueryParams = {}) =>
    apiClient.get<ProjectPaginationResponse>(
      `/projects${buildQueryString(params)}`,
    ),
  getById: (id: string) =>
    apiClient.get<{ project: Project }>(`/projects/${id}`),
  create: (data: ProjectCreateDTO) =>
    apiClient.post<{ project: Project }>("/projects", data),
  update: (id: string, data: ProjectUpdateDTO) =>
    apiClient.put<{ project: Project }>(`/projects/${id}`, data),
  delete: (id: string) => apiClient.delete<unknown>(`/projects/${id}`),
};
