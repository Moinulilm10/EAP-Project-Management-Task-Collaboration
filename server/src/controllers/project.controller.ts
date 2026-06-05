import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import { projectService } from '../services/project.service';

export const projectController = {
  async getAll(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const projects = await projectService.findAll();
      res.status(200).json({ projects });
    } catch (error: any) {
      res.status(error.status || 500).json({ error: error.message || 'Failed to fetch projects.' });
    }
  },

  async getById(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const project = await projectService.findById(req.params.id as string);
      res.status(200).json({ project });
    } catch (error: any) {
      res.status(error.status || 500).json({ error: error.message || 'Failed to fetch project.' });
    }
  },

  async create(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const project = await projectService.create({
        ...req.body,
        ownerId: req.user!.id,
      });
      res.status(201).json({ project });
    } catch (error: any) {
      res.status(error.status || 500).json({ error: error.message || 'Failed to create project.' });
    }
  },

  async update(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const project = await projectService.update(req.params.id as string, req.body);
      res.status(200).json({ project });
    } catch (error: any) {
      res.status(error.status || 500).json({ error: error.message || 'Failed to update project.' });
    }
  },

  async delete(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      await projectService.delete(req.params.id as string);
      res.status(200).json({ message: 'Project deleted successfully.' });
    } catch (error: any) {
      res.status(error.status || 500).json({ error: error.message || 'Failed to delete project.' });
    }
  },
};
