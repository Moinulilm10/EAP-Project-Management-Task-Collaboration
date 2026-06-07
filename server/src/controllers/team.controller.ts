import { Response } from "express";
import { teamService } from "../services/team.service";
import { AuthenticatedRequest } from "../middleware/auth";

export const teamController = {
  async createTeam(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { name, description, maxMembers } = req.body;
      const userId = req.user?.id;

      if (!userId) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }

      const team = await teamService.createTeam(userId, name, description, maxMembers);
      res.status(201).json(team);
    } catch (error: any) {
      res.status(error.status || 500).json({ error: error.message || "Failed to create team" });
    }
  },

  async getTeams(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }

      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const result = await teamService.getTeams(userId, page, limit);
      res.json(result);
    } catch (error: any) {
      res.status(error.status || 500).json({ error: error.message || "Failed to fetch teams" });
    }
  },

  async getTeamById(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      const id = req.params.id as string;
      if (!userId) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }

      const team = await teamService.getTeamById(id, userId);
      res.json(team);
    } catch (error: any) {
      res.status(error.status || 500).json({ error: error.message || "Failed to fetch team" });
    }
  },

  async addMember(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const adminId = req.user?.id;
      const id = req.params.id as string;
      const { userId, role } = req.body;

      if (!adminId) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }

      const member = await teamService.addMember(id, adminId, userId, role);
      res.status(201).json(member);
    } catch (error: any) {
      res.status(error.status || 500).json({ error: error.message || "Failed to add member" });
    }
  },

  async assignProject(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const adminId = req.user?.id;
      const id = req.params.id as string;
      const { projectId } = req.body;

      if (!adminId) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }

      const projectTeam = await teamService.assignProject(id, adminId, projectId);
      res.status(201).json(projectTeam);
    } catch (error: any) {
      res.status(error.status || 500).json({ error: error.message || "Failed to assign project" });
    }
  },

  async assignTask(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const adminId = req.user?.id;
      const id = req.params.id as string;
      const { taskId } = req.body;

      if (!adminId) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }

      const taskTeam = await teamService.assignTask(id, adminId, taskId);
      res.status(201).json(taskTeam);
    } catch (error: any) {
      res.status(error.status || 500).json({ error: error.message || "Failed to assign task" });
    }
  },

  async updateCapacity(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const adminId = req.user?.id;
      const id = req.params.id as string;
      const { maxMembers } = req.body;

      if (!adminId) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }

      const team = await teamService.updateCapacity(id, adminId, maxMembers);
      res.json(team);
    } catch (error: any) {
      res.status(error.status || 500).json({ error: error.message || "Failed to update capacity" });
    }
  },

  async updateTeam(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const adminId = req.user?.id;
      const id = req.params.id as string;
      const { name, description } = req.body;

      if (!adminId) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }

      const team = await teamService.updateTeam(id, adminId, { name, description });
      res.json(team);
    } catch (error: any) {
      res.status(error.status || 500).json({ error: error.message || "Failed to update team" });
    }
  },

  async deleteTeam(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const adminId = req.user?.id;
      const id = req.params.id as string;

      if (!adminId) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }

      const result = await teamService.deleteTeam(id, adminId);
      res.json(result);
    } catch (error: any) {
      res.status(error.status || 500).json({ error: error.message || "Failed to delete team" });
    }
  },

  async removeMember(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const adminId = req.user?.id;
      const id = req.params.id as string;
      const userIdToRemove = req.params.userId as string;

      if (!adminId) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }

      const result = await teamService.removeMember(id, adminId, userIdToRemove);
      res.json(result);
    } catch (error: any) {
      res.status(error.status || 500).json({ error: error.message || "Failed to remove member" });
    }
  }
};
