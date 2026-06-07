import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useTaskStore } from '../../stores/taskStore';
import { taskService } from '../../services/task.service';
import { TaskStatus, TaskPriority } from '../../components/tasks/taskTypes';

vi.mock('../../services/task.service', () => ({
  taskService: {
    getAll: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    updateStatus: vi.fn(),
  },
}));

describe('taskStore', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useTaskStore.setState({ tasks: [], isLoading: false, error: null, total: 0 });
  });

  it('should initialize with correct default state', () => {
    const state = useTaskStore.getState();
    expect(state.tasks).toEqual([]);
    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
    expect(state.total).toBe(0);
  });

  describe('fetchTasks', () => {
    it('should set loading state and populate tasks on success', async () => {
      const mockTasks = [{ id: '1', title: 'Task 1' }, { id: '2', title: 'Task 2' }];
      (taskService.getAll as any).mockResolvedValue({ tasks: mockTasks, total: 2 });

      const promise = useTaskStore.getState().fetchTasks();
      
      expect(useTaskStore.getState().isLoading).toBe(true);
      
      await promise;
      
      const state = useTaskStore.getState();
      expect(state.isLoading).toBe(false);
      expect(state.tasks[0]).toEqual(expect.objectContaining({ id: '1', title: 'Task 1' }));
      expect(state.tasks[1]).toEqual(expect.objectContaining({ id: '2', title: 'Task 2' }));
      expect(state.total).toBe(2);
      expect(state.error).toBeNull();
    });

    it('should set error state on failure', async () => {
      (taskService.getAll as any).mockRejectedValue(new Error('Network error'));

      await useTaskStore.getState().fetchTasks();
      
      const state = useTaskStore.getState();
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe('Network error');
    });
  });

  describe('createTask', () => {
    it('should append new task to state on success', async () => {
      const newTask = { id: '1', title: 'New Task' };
      (taskService.create as any).mockResolvedValue({ task: newTask });
      (taskService.getAll as any).mockResolvedValue({ tasks: [newTask], total: 1 });

      await useTaskStore.getState().createTask({ title: 'New Task', projectId: 'p1' } as any);
      
      const state = useTaskStore.getState();
      expect(state.tasks).toHaveLength(1);
      expect(state.tasks[0]).toEqual(expect.objectContaining({ id: '1', title: 'New Task' }));
      expect(state.total).toBe(1);
    });
  });

  describe('updateTask', () => {
    it('should update existing task in state', async () => {
      const initialTask = { id: '1', title: 'Old Title', status: 'todo' };
      const updatedTask = { ...initialTask, title: 'New Title' };
      
      useTaskStore.setState({ tasks: [initialTask as any], total: 1 });
      (taskService.update as any).mockResolvedValue({ task: updatedTask });
      (taskService.getAll as any).mockResolvedValue({ tasks: [updatedTask], total: 1 });

      await useTaskStore.getState().updateTask('1', { title: 'New Title' });
      
      const state = useTaskStore.getState();
      expect(state.tasks[0].title).toBe('New Title');
    });
  });

  describe('deleteTask', () => {
    it('should remove task from state on success', async () => {
      useTaskStore.setState({ 
        tasks: [{ id: '1', title: 'Task 1' } as any],
        total: 1 
      });
      (taskService.delete as any).mockResolvedValue();
      (taskService.getAll as any).mockResolvedValue({ tasks: [], total: 0 });

      await useTaskStore.getState().deleteTask('1');
      
      const state = useTaskStore.getState();
      expect(state.tasks).toHaveLength(0);
      expect(state.total).toBe(0);
    });
  });
});
