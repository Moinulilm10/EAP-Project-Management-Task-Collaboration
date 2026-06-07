import { describe, it, expect, vi, beforeEach } from 'vitest';
import { taskService } from '../../services/task.service';
import { AppDataSource } from '../../utils/data-source';
import { TaskStatus, TaskPriority } from '../../entities/Task.entity';

// Mock dependencies
vi.mock('../../utils/data-source', () => ({
  AppDataSource: {
    getRepository: vi.fn(),
    createQueryRunner: vi.fn(),
  },
}));

describe('taskService', () => {
  const mockTaskRepo = {
    findOne: vi.fn(),
    find: vi.fn(),
    createQueryBuilder: vi.fn(),
    save: vi.fn(),
    remove: vi.fn(),
  };

  const mockQueryRunner = {
    connect: vi.fn(),
    startTransaction: vi.fn(),
    commitTransaction: vi.fn(),
    rollbackTransaction: vi.fn(),
    release: vi.fn(),
    manager: {
      create: vi.fn(),
      save: vi.fn(),
      findOne: vi.fn(),
      delete: vi.fn(),
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (AppDataSource.getRepository as any).mockImplementation((entity: any) => {
      if (entity.name === 'Task') return mockTaskRepo;
    });
    (AppDataSource.createQueryRunner as any).mockReturnValue(mockQueryRunner);
  });

  describe('create', () => {
    it('should create a task successfully', async () => {
      const data = {
        title: 'New Task',
        projectId: 'proj-1',
        createdById: 'user-1',
        priority: TaskPriority.HIGH,
        status: TaskStatus.TODO,
      };

      const savedTask = { id: 'task-1', ...data };

      mockQueryRunner.manager.findOne.mockResolvedValue(null); // No duplicate
      mockQueryRunner.manager.create.mockImplementation((entity, data) => data);
      mockQueryRunner.manager.save.mockResolvedValue(savedTask);
      
      // We mock findById internal call
      mockTaskRepo.findOne.mockResolvedValue(savedTask);

      const result = await taskService.create(data);

      expect(mockQueryRunner.manager.create).toHaveBeenCalled();
      expect(mockQueryRunner.manager.save).toHaveBeenCalled();
      expect(mockQueryRunner.commitTransaction).toHaveBeenCalled();
      expect(result).toEqual(savedTask);
    });

    it('should throw 400 if task already exists in project', async () => {
      const data = {
        title: 'Duplicate Task',
        projectId: 'proj-1',
        createdById: 'user-1',
      };

      mockQueryRunner.manager.findOne.mockResolvedValue({ id: 'existing-task' });

      await expect(taskService.create(data)).rejects.toEqual({
        status: 400,
        message: 'This task already exists in the project.',
      });
      expect(mockQueryRunner.rollbackTransaction).toHaveBeenCalled();
    });

    it('should throw 400 if due date is in the past', async () => {
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 2);

      const data = {
        title: 'Past Task',
        projectId: 'proj-1',
        createdById: 'user-1',
        dueDate: pastDate.toISOString(),
      };

      mockQueryRunner.manager.findOne.mockResolvedValue(null);

      await expect(taskService.create(data)).rejects.toEqual({
        status: 400,
        message: 'Please select a valid deadline.',
      });
      expect(mockQueryRunner.rollbackTransaction).toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('should update a task successfully', async () => {
      const existingTask = { id: 'task-1', title: 'Old Title', projectId: 'proj-1', status: TaskStatus.TODO };
      mockQueryRunner.manager.findOne
        .mockResolvedValueOnce(existingTask) // For the initial find
        .mockResolvedValueOnce(null); // For the duplicate check

      mockQueryRunner.manager.save.mockResolvedValue(existingTask);
      mockTaskRepo.findOne.mockResolvedValue({ ...existingTask, title: 'New Title' });

      const result = await taskService.update('task-1', { title: 'New Title' });

      expect(mockQueryRunner.manager.save).toHaveBeenCalled();
      expect(result.title).toBe('New Title');
    });

    it('should throw 400 when attempting to reassign a completed task', async () => {
      const existingTask = { 
        id: 'task-1', 
        projectId: 'proj-1', 
        status: TaskStatus.DONE, 
        assigneeId: 'user-1' 
      };
      
      mockQueryRunner.manager.findOne.mockResolvedValueOnce(existingTask);

      await expect(taskService.update('task-1', { assigneeId: 'user-2' })).rejects.toEqual({
        status: 400,
        message: 'Completed tasks cannot be reassigned.',
      });
    });
  });

  describe('updateStatus', () => {
    it('should update status if requested by assignee', async () => {
      const task = { id: 'task-1', assigneeId: 'user-1', status: TaskStatus.TODO };
      mockTaskRepo.findOne.mockResolvedValue(task);
      mockTaskRepo.save.mockImplementation(async (t) => t);

      const result = await taskService.updateStatus('task-1', TaskStatus.IN_PROGRESS, 'user-1');
      expect(result.status).toBe(TaskStatus.IN_PROGRESS);
    });

    it('should throw 403 if requested by non-assignee', async () => {
      const task = { id: 'task-1', assigneeId: 'user-1', status: TaskStatus.TODO };
      mockTaskRepo.findOne.mockResolvedValue(task);

      await expect(taskService.updateStatus('task-1', TaskStatus.IN_PROGRESS, 'user-2')).rejects.toEqual({
        status: 403,
        message: 'Team members can only update the status of tasks assigned to them.',
      });
    });
  });

  describe('delete', () => {
    it('should delete task if found', async () => {
      const task = { id: 'task-1' };
      mockTaskRepo.findOne.mockResolvedValue(task);
      mockTaskRepo.remove.mockResolvedValue(task);

      await expect(taskService.delete('task-1')).resolves.not.toThrow();
      expect(mockTaskRepo.remove).toHaveBeenCalledWith(task);
    });

    it('should throw 404 if not found', async () => {
      mockTaskRepo.findOne.mockResolvedValue(null);

      await expect(taskService.delete('invalid-id')).rejects.toEqual({
        status: 404,
        message: 'Task not found.',
      });
    });
  });
});
