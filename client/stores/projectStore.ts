import { create } from "zustand";
import {
  Project,
  ProjectCreateDTO,
  projectService,
  ProjectSummary,
  ProjectUpdateDTO,
} from "../services/project.service";

export interface ProjectStoreState {
  projects: ProjectSummary[];
  loading: boolean;
  error: string | null;
  page: number;
  limit: number;
  total: number;
  statusFilter: "all" | "active" | "completed" | "on_hold";
  searchQuery: string;
  setStatusFilter: (status: ProjectStoreState["statusFilter"]) => void;
  setSearchQuery: (query: string) => void;
  setPage: (page: number) => void;
  fetchProjects: () => Promise<void>;
  createProject: (payload: ProjectCreateDTO) => Promise<Project>;
  updateProject: (id: string, payload: ProjectUpdateDTO) => Promise<Project>;
  deleteProject: (id: string) => Promise<void>;
}

export const useProjectStore = create<ProjectStoreState>((set, get) => ({
  projects: [],
  loading: false,
  error: null,
  page: 1,
  limit: 12,
  total: 0,
  statusFilter: "all",
  searchQuery: "",

  setStatusFilter: (status) => set({ statusFilter: status, page: 1 }),
  setSearchQuery: (query) => set({ searchQuery: query, page: 1 }),
  setPage: (page) => set({ page }),

  fetchProjects: async () => {
    set({ loading: true, error: null });
    try {
      const { statusFilter, searchQuery, page, limit } = get();
      const response = await projectService.getAll({
        status: statusFilter === "all" ? undefined : statusFilter,
        search: searchQuery.trim() || undefined,
        page,
        limit,
      });

      set({
        projects: response.projects || [],
        total: response.total || 0,
        loading: false,
      });
    } catch (error: unknown) {
      set({
        loading: false,
        error:
          error instanceof Error ? error.message : "Unable to load projects",
      });
    }
  },

  createProject: async (payload) => {
    const response = await projectService.create(payload);
    await get().fetchProjects();
    return response.project;
  },

  updateProject: async (id, payload) => {
    const response = await projectService.update(id, payload);
    await get().fetchProjects();
    return response.project;
  },

  deleteProject: async (id) => {
    await projectService.delete(id);
    await get().fetchProjects();
  },
}));
