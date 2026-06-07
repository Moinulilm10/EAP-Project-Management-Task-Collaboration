import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useTeamStore } from '../../stores/teamStore';
import { teamService } from '../../services/team.service';

vi.mock('../../services/team.service', () => ({
  teamService: {
    getAll: vi.fn(),
    create: vi.fn(),
    addMember: vi.fn(),
    assignProject: vi.fn(),
    assignTask: vi.fn(),
    updateCapacity: vi.fn(),
    updateTeam: vi.fn(),
    deleteTeam: vi.fn(),
    removeMember: vi.fn(),
  },
  TeamRoleName: {
    ADMIN: 'Admin',
    MEMBER: 'Member'
  }
}));

describe('teamStore', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useTeamStore.setState({
      teams: [],
      meta: null,
      loading: false,
      error: null,
    });
  });

  describe('fetchTeams', () => {
    it('should fetch teams and update state on success', async () => {
      const mockTeams = [{ id: '1', name: 'Team 1' }];
      const mockMeta = { total: 1, page: 1, limit: 9, totalPages: 1 };
      
      (teamService.getAll as any).mockResolvedValueOnce({
        data: mockTeams,
        meta: mockMeta,
      });

      await useTeamStore.getState().fetchTeams();

      const state = useTeamStore.getState();
      expect(state.loading).toBe(false);
      expect(state.teams).toEqual(mockTeams);
      expect(state.meta).toEqual(mockMeta);
      expect(state.error).toBeNull();
    });

    it('should set error on failure', async () => {
      (teamService.getAll as any).mockRejectedValueOnce(new Error('Network error'));

      await useTeamStore.getState().fetchTeams();

      const state = useTeamStore.getState();
      expect(state.loading).toBe(false);
      expect(state.teams).toEqual([]);
      expect(state.error).toBe('Network error');
    });
  });

  describe('createTeam', () => {
    it('should create a team and trigger fetchTeams', async () => {
      (teamService.create as any).mockResolvedValueOnce({});
      (teamService.getAll as any).mockResolvedValueOnce({
        data: [{ id: '1', name: 'New Team' }],
        meta: { total: 1 },
      });

      await useTeamStore.getState().createTeam({ name: 'New Team' });

      expect(teamService.create).toHaveBeenCalledWith({ name: 'New Team' });
      expect(teamService.getAll).toHaveBeenCalled();
      const state = useTeamStore.getState();
      expect(state.teams).toHaveLength(1);
    });

    it('should set error on create failure', async () => {
      (teamService.create as any).mockRejectedValueOnce(new Error('Create failed'));

      await expect(useTeamStore.getState().createTeam({ name: 'New Team' })).rejects.toThrow('Create failed');

      const state = useTeamStore.getState();
      expect(state.error).toBe('Create failed');
    });
  });

  describe('addMember', () => {
    it('should add a member and refresh teams', async () => {
      (teamService.addMember as any).mockResolvedValueOnce({});
      (teamService.getAll as any).mockResolvedValueOnce({ data: [], meta: null });

      await useTeamStore.getState().addMember('team-1', 'user-1', 'Member');

      expect(teamService.addMember).toHaveBeenCalledWith('team-1', 'user-1', 'Member');
      expect(teamService.getAll).toHaveBeenCalled();
    });
  });

  describe('removeMember', () => {
    it('should remove a member and refresh teams', async () => {
      (teamService.removeMember as any).mockResolvedValueOnce({});
      (teamService.getAll as any).mockResolvedValueOnce({ data: [], meta: null });

      await useTeamStore.getState().removeMember('team-1', 'user-1');

      expect(teamService.removeMember).toHaveBeenCalledWith('team-1', 'user-1');
      expect(teamService.getAll).toHaveBeenCalled();
    });
  });

  describe('updateCapacity', () => {
    it('should update capacity and refresh teams', async () => {
      (teamService.updateCapacity as any).mockResolvedValueOnce({});
      (teamService.getAll as any).mockResolvedValueOnce({ data: [], meta: null });

      await useTeamStore.getState().updateCapacity('team-1', 20);

      expect(teamService.updateCapacity).toHaveBeenCalledWith('team-1', 20);
      expect(teamService.getAll).toHaveBeenCalled();
    });
  });

  describe('deleteTeam', () => {
    it('should delete team and refresh teams', async () => {
      (teamService.deleteTeam as any).mockResolvedValueOnce({});
      (teamService.getAll as any).mockResolvedValueOnce({ data: [], meta: null });

      await useTeamStore.getState().deleteTeam('team-1');

      expect(teamService.deleteTeam).toHaveBeenCalledWith('team-1');
      expect(teamService.getAll).toHaveBeenCalled();
    });
  });
});
