"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.teamController = void 0;
const team_service_1 = require("../services/team.service");
exports.teamController = {
    async createTeam(req, res) {
        try {
            const { name, description, maxMembers } = req.body;
            const userId = req.user?.id;
            if (!userId) {
                res.status(401).json({ error: "Unauthorized" });
                return;
            }
            const team = await team_service_1.teamService.createTeam(userId, name, description, maxMembers);
            res.status(201).json(team);
        }
        catch (error) {
            res.status(error.status || 500).json({ error: error.message || "Failed to create team" });
        }
    },
    async getTeams(req, res) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                res.status(401).json({ error: "Unauthorized" });
                return;
            }
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const result = await team_service_1.teamService.getTeams(userId, page, limit);
            res.json(result);
        }
        catch (error) {
            res.status(error.status || 500).json({ error: error.message || "Failed to fetch teams" });
        }
    },
    async getTeamById(req, res) {
        try {
            const userId = req.user?.id;
            const id = req.params.id;
            if (!userId) {
                res.status(401).json({ error: "Unauthorized" });
                return;
            }
            const team = await team_service_1.teamService.getTeamById(id, userId);
            res.json(team);
        }
        catch (error) {
            res.status(error.status || 500).json({ error: error.message || "Failed to fetch team" });
        }
    },
    async addMember(req, res) {
        try {
            const adminId = req.user?.id;
            const id = req.params.id;
            const { userId, role } = req.body;
            if (!adminId) {
                res.status(401).json({ error: "Unauthorized" });
                return;
            }
            const member = await team_service_1.teamService.addMember(id, adminId, userId, role);
            res.status(201).json(member);
        }
        catch (error) {
            res.status(error.status || 500).json({ error: error.message || "Failed to add member" });
        }
    },
    async assignProject(req, res) {
        try {
            const adminId = req.user?.id;
            const id = req.params.id;
            const { projectId } = req.body;
            if (!adminId) {
                res.status(401).json({ error: "Unauthorized" });
                return;
            }
            const projectTeam = await team_service_1.teamService.assignProject(id, adminId, projectId);
            res.status(201).json(projectTeam);
        }
        catch (error) {
            res.status(error.status || 500).json({ error: error.message || "Failed to assign project" });
        }
    },
    async assignTask(req, res) {
        try {
            const adminId = req.user?.id;
            const id = req.params.id;
            const { taskId } = req.body;
            if (!adminId) {
                res.status(401).json({ error: "Unauthorized" });
                return;
            }
            const taskTeam = await team_service_1.teamService.assignTask(id, adminId, taskId);
            res.status(201).json(taskTeam);
        }
        catch (error) {
            res.status(error.status || 500).json({ error: error.message || "Failed to assign task" });
        }
    },
    async updateCapacity(req, res) {
        try {
            const adminId = req.user?.id;
            const id = req.params.id;
            const { maxMembers } = req.body;
            if (!adminId) {
                res.status(401).json({ error: "Unauthorized" });
                return;
            }
            const team = await team_service_1.teamService.updateCapacity(id, adminId, maxMembers);
            res.json(team);
        }
        catch (error) {
            res.status(error.status || 500).json({ error: error.message || "Failed to update capacity" });
        }
    },
    async updateTeam(req, res) {
        try {
            const adminId = req.user?.id;
            const id = req.params.id;
            const { name, description } = req.body;
            if (!adminId) {
                res.status(401).json({ error: "Unauthorized" });
                return;
            }
            const team = await team_service_1.teamService.updateTeam(id, adminId, { name, description });
            res.json(team);
        }
        catch (error) {
            res.status(error.status || 500).json({ error: error.message || "Failed to update team" });
        }
    },
    async deleteTeam(req, res) {
        try {
            const adminId = req.user?.id;
            const id = req.params.id;
            if (!adminId) {
                res.status(401).json({ error: "Unauthorized" });
                return;
            }
            const result = await team_service_1.teamService.deleteTeam(id, adminId);
            res.json(result);
        }
        catch (error) {
            res.status(error.status || 500).json({ error: error.message || "Failed to delete team" });
        }
    },
    async removeMember(req, res) {
        try {
            const adminId = req.user?.id;
            const id = req.params.id;
            const userIdToRemove = req.params.userId;
            if (!adminId) {
                res.status(401).json({ error: "Unauthorized" });
                return;
            }
            const result = await team_service_1.teamService.removeMember(id, adminId, userIdToRemove);
            res.json(result);
        }
        catch (error) {
            res.status(error.status || 500).json({ error: error.message || "Failed to remove member" });
        }
    }
};
