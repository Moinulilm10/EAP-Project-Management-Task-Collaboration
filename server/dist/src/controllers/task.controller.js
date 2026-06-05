"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.taskController = void 0;
const task_service_1 = require("../services/task.service");
const User_entity_1 = require("../entities/User.entity");
exports.taskController = {
    async getAll(req, res) {
        try {
            const tasks = await task_service_1.taskService.findAll(req.user.id, req.user.role);
            res.status(200).json({ tasks });
        }
        catch (error) {
            res.status(error.status || 500).json({ error: error.message || 'Failed to fetch tasks.' });
        }
    },
    async getById(req, res) {
        try {
            const task = await task_service_1.taskService.findById(req.params.id);
            res.status(200).json({ task });
        }
        catch (error) {
            res.status(error.status || 500).json({ error: error.message || 'Failed to fetch task.' });
        }
    },
    async create(req, res) {
        try {
            const task = await task_service_1.taskService.create({
                ...req.body,
                createdById: req.user.id,
            });
            res.status(201).json({ task });
        }
        catch (error) {
            res.status(error.status || 500).json({ error: error.message || 'Failed to create task.' });
        }
    },
    /**
     * Update endpoint with role-aware logic:
     * - Admin/PM: Full field update
     * - Team Member: Status-only update (enforced at service layer)
     */
    async update(req, res) {
        try {
            let task;
            if (req.user.role === User_entity_1.UserRole.TEAM_MEMBER) {
                // Team member: status-only update with ownership verification
                task = await task_service_1.taskService.updateStatus(req.params.id, req.body.status, req.user.id);
            }
            else {
                // Admin/PM: full update
                task = await task_service_1.taskService.update(req.params.id, req.body);
            }
            res.status(200).json({ task });
        }
        catch (error) {
            res.status(error.status || 500).json({ error: error.message || 'Failed to update task.' });
        }
    },
    async delete(req, res) {
        try {
            await task_service_1.taskService.delete(req.params.id);
            res.status(200).json({ message: 'Task deleted successfully.' });
        }
        catch (error) {
            res.status(error.status || 500).json({ error: error.message || 'Failed to delete task.' });
        }
    },
};
