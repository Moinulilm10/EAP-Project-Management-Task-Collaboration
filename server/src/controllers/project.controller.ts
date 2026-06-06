import { Response } from "express";
import { ProjectStatus } from "../entities/Project.entity";
import { AuthenticatedRequest } from "../middleware/auth";
import { projectService } from "../services/project.service";

const isValidProjectStatus = (
  value: string | undefined,
): value is ProjectStatus =>
  value === "active" || value === "completed" || value === "on_hold";

export const projectController = {
  async getAll(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const statusQuery = req.query.status as string | undefined;
      const filters: import("../services/project.service").ProjectQueryOptions =
        {
          status: isValidProjectStatus(statusQuery) ? statusQuery : undefined,
          search: req.query.search as string | undefined,
          page: req.query.page ? Number(req.query.page) : undefined,
          limit: req.query.limit ? Number(req.query.limit) : undefined,
          userId: req.user?.id,
        };

      const result = await projectService.findAll(filters);
      res.status(200).json(result);
    } catch (error: any) {
      res
        .status(error.status || 500)
        .json({ error: error.message || "Failed to fetch projects." });
    }
  },

  async getById(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const project = await projectService.findById(req.params.id as string);
      res.status(200).json({ project });
    } catch (error: any) {
      res
        .status(error.status || 500)
        .json({ error: error.message || "Failed to fetch project." });
    }
  },

  async create(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: "Authentication required." });
        return;
      }

      const project = await projectService.create({
        ...req.body,
        ownerId: req.user.id,
      });
      res.status(201).json({ project });
    } catch (error: any) {
      res
        .status(error.status || 500)
        .json({ error: error.message || "Failed to create project." });
    }
  },

  async update(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: "Authentication required." });
        return;
      }

      const project = await projectService.update(
        req.params.id as string,
        req.body,
        req.user.id,
      );
      res.status(200).json({ project });
    } catch (error: any) {
      res
        .status(error.status || 500)
        .json({ error: error.message || "Failed to update project." });
    }
  },

  async delete(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: "Authentication required." });
        return;
      }

      await projectService.delete(req.params.id as string, req.user.id);
      res.status(200).json({ message: "Project deleted successfully." });
    } catch (error: any) {
      res
        .status(error.status || 500)
        .json({ error: error.message || "Failed to delete project." });
    }
  },
};
