import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useProjectStore } from '../../stores/projectStore';
import { projectService } from '../../services/project.service';

vi.mock('../../services/project.service', () => ({
  projectService: {
    getAll: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
}));

describe('projectStore', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset store state
    useProjectStore.setState({
      projects: [],
      loading: false,
      error: null,
      page: 1,
      limit: 12,
      total: 0,
      statusFilter: 'all',
      searchQuery: '',
      adminOnlyFilter: false,
    });
  });

  it('should initialize with default values', () => {
    const state = useProjectStore.getState();
    expect(state.projects).toEqual([]);
    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
    expect(state.page).toBe(1);
    expect(state.statusFilter).toBe('all');
    expect(state.adminOnlyFilter).toBe(false);
  });

  it('should set filters correctly and reset page to 1', () => {
    useProjectStore.getState().setPage(5);
    expect(useProjectStore.getState().page).toBe(5);

    useProjectStore.getState().setStatusFilter('active');
    expect(useProjectStore.getState().statusFilter).toBe('active');
    expect(useProjectStore.getState().page).toBe(1);

    useProjectStore.getState().setPage(3);
    useProjectStore.getState().setAdminOnlyFilter(true);
    expect(useProjectStore.getState().adminOnlyFilter).toBe(true);
    expect(useProjectStore.getState().page).toBe(1);
  });

  it('should fetch projects successfully', async () => {
    const mockResponse = {
      projects: [{ id: 'p1', name: 'Proj 1', status: 'active', progress: 10, memberCount: 1 }],
      total: 1,
    };
    (projectService.getAll as any).mockResolvedValue(mockResponse);

    await useProjectStore.getState().fetchProjects();

    const state = useProjectStore.getState();
    expect(projectService.getAll).toHaveBeenCalledWith({
      status: undefined,
      search: undefined,
      page: 1,
      limit: 12,
      adminOnly: undefined,
      sortBy: "createdAt_desc",
      deadlineStatus: undefined,
    });
    expect(state.projects).toEqual(mockResponse.projects);
    expect(state.total).toBe(1);
    expect(state.loading).toBe(false);
  });

  it('should handle fetch errors', async () => {
    (projectService.getAll as any).mockRejectedValue(new Error('Network Error'));

    await useProjectStore.getState().fetchProjects();

    const state = useProjectStore.getState();
    expect(state.loading).toBe(false);
    expect(state.error).toBe('Network Error');
    expect(state.projects).toEqual([]);
  });
});
