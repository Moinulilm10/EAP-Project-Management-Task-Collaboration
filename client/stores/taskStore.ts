import { create } from 'zustand';
import { taskService } from '../services/task.service';
import { Task, TaskPriority, TaskStatus } from '../components/tasks/taskTypes';

export interface TaskFilterOptions {
  search?: string;
  status?: TaskStatus | 'all';
  priority?: TaskPriority | 'all';
  page?: number;
  limit?: number;
}

interface TaskState {
  tasks: Task[];
  total: number;
  page: number;
  limit: number;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchTasks: (options?: TaskFilterOptions) => Promise<void>;
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
  isLoading: false,
  error: null,

  fetchTasks: async (options?: TaskFilterOptions) => {
    set({ isLoading: true, error: null });
    try {
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
        status: t.status,
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
        tags: [],
        subtasks: []
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
