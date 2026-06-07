import { create } from "zustand";
import { Team, TeamCreateDTO, teamService } from "../services/team.service";

interface TeamState {
  teams: Team[];
  loading: boolean;
  error: string | null;
  fetchTeams: () => Promise<void>;
  createTeam: (data: TeamCreateDTO) => Promise<void>;
  addMember: (teamId: string, userId: string, role: string) => Promise<void>;
  assignProject: (teamId: string, projectId: string) => Promise<void>;
  assignTask: (teamId: string, taskId: string) => Promise<void>;
  updateCapacity: (teamId: string, maxMembers: number) => Promise<void>;
  updateTeam: (teamId: string, payload: { name?: string; description?: string }) => Promise<void>;
  deleteTeam: (teamId: string) => Promise<void>;
  removeMember: (teamId: string, userId: string) => Promise<void>;
}

export const useTeamStore = create<TeamState>((set, get) => ({
  teams: [],
  loading: false,
  error: null,

  fetchTeams: async () => {
    set({ loading: true, error: null });
    try {
      const data = await teamService.getAll();
      set({ teams: data, loading: false });
    } catch (err: any) {
      set({ error: err.message || "Failed to fetch teams", loading: false });
    }
  },

  createTeam: async (data: TeamCreateDTO) => {
    set({ loading: true, error: null });
    try {
      await teamService.create(data);
      await get().fetchTeams();
    } catch (err: any) {
      set({ error: err.message || "Failed to create team", loading: false });
      throw err;
    }
  },

  addMember: async (teamId: string, userId: string, role: string) => {
    set({ loading: true, error: null });
    try {
      await teamService.addMember(teamId, userId, role);
      await get().fetchTeams();
    } catch (err: any) {
      set({ error: err.message || "Failed to add member", loading: false });
      throw err;
    }
  },

  assignProject: async (teamId: string, projectId: string) => {
    set({ loading: true, error: null });
    try {
      await teamService.assignProject(teamId, projectId);
      await get().fetchTeams();
    } catch (err: any) {
      set({ error: err.message || "Failed to assign project", loading: false });
      throw err;
    }
  },

  assignTask: async (teamId: string, taskId: string) => {
    set({ loading: true, error: null });
    try {
      await teamService.assignTask(teamId, taskId);
      await get().fetchTeams();
    } catch (err: any) {
      set({ error: err.message || "Failed to assign task", loading: false });
      throw err;
    }
  },

  updateCapacity: async (teamId: string, maxMembers: number) => {
    set({ loading: true, error: null });
    try {
      await teamService.updateCapacity(teamId, maxMembers);
      await get().fetchTeams();
    } catch (err: any) {
      set({ error: err.message || "Failed to update capacity", loading: false });
      throw err;
    }
  },

  updateTeam: async (teamId: string, payload: { name?: string; description?: string }) => {
    set({ loading: true, error: null });
    try {
      await teamService.updateTeam(teamId, payload);
      await get().fetchTeams();
    } catch (err: any) {
      set({ error: err.message || "Failed to update team", loading: false });
      throw err;
    }
  },

  deleteTeam: async (teamId: string) => {
    set({ loading: true, error: null });
    try {
      await teamService.deleteTeam(teamId);
      await get().fetchTeams();
    } catch (err: any) {
      set({ error: err.message || "Failed to delete team", loading: false });
      throw err;
    }
  },

  removeMember: async (teamId: string, userId: string) => {
    set({ loading: true, error: null });
    try {
      await teamService.removeMember(teamId, userId);
      await get().fetchTeams();
    } catch (err: any) {
      set({ error: err.message || "Failed to remove member", loading: false });
      throw err;
    }
  },
}));
