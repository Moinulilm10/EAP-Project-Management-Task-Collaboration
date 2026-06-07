import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import { taskService } from '../services/task.service';
import { ProjectMember, ProjectRoleName } from '../entities/ProjectMember.entity';
import { AppDataSource } from '../utils/data-source';

const memberRepo = () => AppDataSource.getRepository(ProjectMember);

export const taskController = {
  async getAll(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Authentication required.' });
        return;
      }
      
      const { search, status, priority, page, limit } = req.query;
      const options = {
        search: search as string,
        status: status as any,
        priority: priority as any,
        page: page ? parseInt(page as string, 10) : 1,
        limit: limit ? parseInt(limit as string, 10) : 10,
      };

      const { tasks, total } = await taskService.findAll(req.user.id, options);
      res.status(200).json({ tasks, total, page: options.page, limit: options.limit });
    } catch (error: any) {
      res.status(error.status || 500).json({ error: error.message || 'Failed to fetch tasks.' });
    }
  },

  async getById(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Authentication required.' });
        return;
      }
      const task = await taskService.findById(req.params.id as string);

      // Check if user is a member of the project
      const isMember = await memberRepo().count({
        where: { projectId: task.projectId, userId: req.user.id }
      });

      if (!isMember) {
        res.status(403).json({ error: 'Forbidden', message: 'You are not a member of this project.' });
        return;
      }

      res.status(200).json({ task });
    } catch (error: any) {
      res.status(error.status || 500).json({ error: error.message || 'Failed to fetch task.' });
    }
  },

  async create(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Authentication required.' });
        return;
      }

      const { projectId } = req.body;
      if (!projectId) {
        res.status(400).json({ error: 'Project ID is required.' });
        return;
      }

      const membership = await memberRepo().findOne({
        where: { projectId, userId: req.user.id },
        relations: { role: true },
      });

      if (!membership || !membership.role || (membership.role.name !== ProjectRoleName.ADMIN && membership.role.name !== ProjectRoleName.PROJECT_MANAGER)) {
        res.status(403).json({
          error: 'Forbidden',
          message: 'Only project admins and project managers can create tasks.',
        });
        return;
      }

      const task = await taskService.create({
        ...req.body,
        createdById: req.user.id,
      });
      res.status(201).json({ task });
    } catch (error: any) {
      res.status(error.status || 500).json({ error: error.message || 'Failed to create task.' });
    }
  },

  async update(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Authentication required.' });
        return;
      }

      const taskId = req.params.id as string;
      const task = await taskService.findById(taskId);

      const membership = await memberRepo().findOne({
        where: { projectId: task.projectId, userId: req.user.id },
        relations: { role: true },
      });

      if (!membership) {
        res.status(403).json({ error: 'Forbidden', message: 'You are not a member of this project.' });
        return;
      }

      let updatedTask;
      if (membership.role && membership.role.name === ProjectRoleName.TEAM_MEMBER) {
        // Team member: status-only update with ownership verification
        updatedTask = await taskService.updateStatus(
          taskId,
          req.body.status,
          req.user.id
        );
      } else {
        // Admin/PM: full update
        updatedTask = await taskService.update(taskId, req.body);
      }

      res.status(200).json({ task: updatedTask });
    } catch (error: any) {
      res.status(error.status || 500).json({ error: error.message || 'Failed to update task.' });
    }
  },

  async delete(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Authentication required.' });
        return;
      }

      const taskId = req.params.id as string;
      const task = await taskService.findById(taskId);

      const membership = await memberRepo().findOne({
        where: { projectId: task.projectId, userId: req.user.id },
        relations: { role: true },
      });

      if (!membership || !membership.role || (membership.role.name !== ProjectRoleName.ADMIN && membership.role.name !== ProjectRoleName.PROJECT_MANAGER)) {
        res.status(403).json({
          error: 'Forbidden',
          message: 'Only project admins and project managers can delete tasks.',
        });
        return;
      }

      await taskService.delete(taskId);
      res.status(200).json({ message: 'Task deleted successfully.' });
    } catch (error: any) {
      res.status(error.status || 500).json({ error: error.message || 'Failed to delete task.' });
    }
  },
};
