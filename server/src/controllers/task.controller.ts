import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import { taskService } from '../services/task.service';
import { UserRole } from '../entities/User.entity';

export const taskController = {
  async getAll(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const tasks = await taskService.findAll(req.user!.id, req.user!.role);
      res.status(200).json({ tasks });
    } catch (error: any) {
      res.status(error.status || 500).json({ error: error.message || 'Failed to fetch tasks.' });
    }
  },

  async getById(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const task = await taskService.findById(req.params.id as string);
      res.status(200).json({ task });
    } catch (error: any) {
      res.status(error.status || 500).json({ error: error.message || 'Failed to fetch task.' });
    }
  },

  async create(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const task = await taskService.create({
        ...req.body,
        createdById: req.user!.id,
      });
      res.status(201).json({ task });
    } catch (error: any) {
      res.status(error.status || 500).json({ error: error.message || 'Failed to create task.' });
    }
  },

  /**
   * Update endpoint with role-aware logic:
   * - Admin/PM: Full field update
   * - Team Member: Status-only update (enforced at service layer)
   */
  async update(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      let task;

      if (req.user!.role === UserRole.TEAM_MEMBER) {
        // Team member: status-only update with ownership verification
        task = await taskService.updateStatus(
          req.params.id as string,
          req.body.status,
          req.user!.id
        );
      } else {
        // Admin/PM: full update
        task = await taskService.update(req.params.id as string, req.body);
      }

      res.status(200).json({ task });
    } catch (error: any) {
      res.status(error.status || 500).json({ error: error.message || 'Failed to update task.' });
    }
  },

  async delete(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      await taskService.delete(req.params.id as string);
      res.status(200).json({ message: 'Task deleted successfully.' });
    } catch (error: any) {
      res.status(error.status || 500).json({ error: error.message || 'Failed to delete task.' });
    }
  },
};
