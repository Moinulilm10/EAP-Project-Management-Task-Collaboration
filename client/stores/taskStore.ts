import { create } from 'zustand';
import { taskService } from '../services/task.service';
import { Task, TaskPriority, TaskStatus } from '../components/tasks/taskTypes';

export interface TaskFilterOptions {
  search?: string;
  status?: TaskStatus | 'all';
  priority?: TaskPriority | 'all';
  page?: number;
  limit?: number;
  sortBy?: string;
  deadlineStatus?: 'upcoming' | 'overdue' | 'all';
  assigneeId?: string | 'all';
}

interface TaskState {
  tasks: Task[];
  total: number;
  page: number;
  limit: number;
  searchQuery: string;
  statusFilter: TaskStatus | 'all';
  priorityFilter: TaskPriority | 'all';
  sortBy: string;
  deadlineStatus: 'upcoming' | 'overdue' | 'all';
  assigneeId: string | 'all';
  isLoading: boolean;
  error: string | null;

  // Actions
  setPage: (page: number) => void;
  setSearchQuery: (query: string) => void;
  setStatusFilter: (status: TaskStatus | 'all') => void;
  setPriorityFilter: (priority: TaskPriority | 'all') => void;
  setSortBy: (sort: string) => void;
  setDeadlineStatus: (status: 'upcoming' | 'overdue' | 'all') => void;
  setAssigneeId: (assigneeId: string | 'all') => void;

  fetchTasks: () => Promise<void>;
  createTask: (data: any) => Promise<Task>;
  updateTask: (id: string, data: any) => Promise<Task>;
  deleteTask: (id: string) => Promise<void>;
  updateTaskStatus: (id: string, status: TaskStatus) => Promise<void>;
}

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  total: 0,
  page: 1,
  limit: 10,
  searchQuery: '',
  statusFilter: 'all',
  priorityFilter: 'all',
  sortBy: 'createdAt_desc',
  deadlineStatus: 'all',
  assigneeId: 'all',
  isLoading: false,
  error: null,

  setPage: (page) => set({ page }),
  setSearchQuery: (searchQuery) => set({ searchQuery, page: 1 }),
  setStatusFilter: (statusFilter) => set({ statusFilter, page: 1 }),
  setPriorityFilter: (priorityFilter) => set({ priorityFilter, page: 1 }),
  setSortBy: (sortBy) => set({ sortBy, page: 1 }),
  setDeadlineStatus: (deadlineStatus) => set({ deadlineStatus, page: 1 }),
  setAssigneeId: (assigneeId) => set({ assigneeId, page: 1 }),

  fetchTasks: async () => {
    set({ isLoading: true, error: null });
    try {
      const { page, limit, searchQuery, statusFilter, priorityFilter, sortBy, deadlineStatus, assigneeId } = get();
      const options: TaskFilterOptions = {
        page, limit, search: searchQuery, status: statusFilter, priority: priorityFilter, sortBy, deadlineStatus, assigneeId
      };
      const response: any = await taskService.getAll(options);
      // Map backend tasks to the Task format expected by the UI if necessary
      // For now, assuming the API returns tasks matching the shape or we map them in the UI.
      const rawTasks = response.tasks || [];
      const mappedTasks = rawTasks.map((t: any) => ({
        id: t.id,
        title: t.title,
        description: t.description || '',
        project: t.project?.name || 'Unknown Project',
        projectId: t.projectId,
        status: t.status === 'in_progress' ? 'in-progress' : t.status,
        priority: t.priority,
        dueDate: t.dueDate ? new Date(t.dueDate).toISOString().split('T')[0] : '',
        assignee: t.assignee ? {
          name: t.assignee.name,
          initials: t.assignee.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase(),
          bg: 'bg-primary text-on-primary'
        } : {
          name: 'Unassigned',
          initials: '?',
          bg: 'bg-surface-container-high text-secondary'
        },
        assigneeId: t.assigneeId,
        teamId: t.taskTeams?.[0]?.teamId || null,
        createdById: t.createdById,
        attachmentCount: t.attachmentCount || 0,
        tags: t.priority === 'critical' || t.priority === 'high' ? ['Urgent', 'Review'] : ['Feature', 'Dev'],
        subtasks: [
          { id: `${t.id}-s1`, title: 'Verify requirements', done: true },
          { id: `${t.id}-s2`, title: 'Code implementation', done: t.status === 'done' || t.status === 'review' },
          { id: `${t.id}-s3`, title: 'Code review', done: t.status === 'done' }
        ]
      }));

      set({
        tasks: mappedTasks,
        total: response.total || 0,
        page: response.page || 1,
        limit: response.limit || 10,
        isLoading: false,
      });
    } catch (err: any) {
      console.error('Failed to fetch tasks:', err);
      set({ error: err.response?.data?.error || err.message, isLoading: false });
    }
  },

  createTask: async (data: any) => {
    set({ isLoading: true, error: null });
    try {
      const response: any = await taskService.create(data);
      await get().fetchTasks(); // Refresh to ensure valid state
      set({ isLoading: false });
      return response.task;
    } catch (err: any) {
      console.error('Failed to create task:', err);
      set({ error: err.response?.data?.error || err.message, isLoading: false });
      throw err;
    }
  },

  updateTask: async (id: string, data: any) => {
    set({ isLoading: true, error: null });
    try {
      const response: any = await taskService.update(id, data);
      await get().fetchTasks();
      set({ isLoading: false });
      return response.task;
    } catch (err: any) {
      console.error('Failed to update task:', err);
      set({ error: err.response?.data?.error || err.message, isLoading: false });
      throw err;
    }
  },

  deleteTask: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await taskService.delete(id);
      await get().fetchTasks();
      set({ isLoading: false });
    } catch (err: any) {
      console.error('Failed to delete task:', err);
      set({ error: err.response?.data?.error || err.message, isLoading: false });
      throw err;
    }
  },

  updateTaskStatus: async (id: string, status: TaskStatus) => {
    try {
      await taskService.update(id, { status });
      await get().fetchTasks();
    } catch (err: any) {
      console.error('Failed to update task status:', err);
      set({ error: err.response?.data?.error || err.message });
      throw err;
    }
  },
}));
