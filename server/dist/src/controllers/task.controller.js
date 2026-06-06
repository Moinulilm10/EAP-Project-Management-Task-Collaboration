"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.taskController = void 0;
const task_service_1 = require("../services/task.service");
const ProjectMember_entity_1 = require("../entities/ProjectMember.entity");
const data_source_1 = require("../utils/data-source");
const memberRepo = () => data_source_1.AppDataSource.getRepository(ProjectMember_entity_1.ProjectMember);
exports.taskController = {
    async getAll(req, res) {
        try {
            if (!req.user) {
                res.status(401).json({ error: 'Authentication required.' });
                return;
            }
            const tasks = await task_service_1.taskService.findAll(req.user.id);
            res.status(200).json({ tasks });
        }
        catch (error) {
            res.status(error.status || 500).json({ error: error.message || 'Failed to fetch tasks.' });
        }
    },
    async getById(req, res) {
        try {
            if (!req.user) {
                res.status(401).json({ error: 'Authentication required.' });
                return;
            }
            const task = await task_service_1.taskService.findById(req.params.id);
            // Check if user is a member of the project
            const isMember = await memberRepo().count({
                where: { projectId: task.projectId, userId: req.user.id }
            });
            if (!isMember) {
                res.status(403).json({ error: 'Forbidden', message: 'You are not a member of this project.' });
                return;
            }
            res.status(200).json({ task });
        }
        catch (error) {
            res.status(error.status || 500).json({ error: error.message || 'Failed to fetch task.' });
        }
    },
    async create(req, res) {
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
            if (!membership || !membership.role || (membership.role.name !== ProjectMember_entity_1.ProjectRoleName.ADMIN && membership.role.name !== ProjectMember_entity_1.ProjectRoleName.PROJECT_MANAGER)) {
                res.status(403).json({
                    error: 'Forbidden',
                    message: 'Only project admins and project managers can create tasks.',
                });
                return;
            }
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
    async update(req, res) {
        try {
            if (!req.user) {
                res.status(401).json({ error: 'Authentication required.' });
                return;
            }
            const taskId = req.params.id;
            const task = await task_service_1.taskService.findById(taskId);
            const membership = await memberRepo().findOne({
                where: { projectId: task.projectId, userId: req.user.id },
                relations: { role: true },
            });
            if (!membership) {
                res.status(403).json({ error: 'Forbidden', message: 'You are not a member of this project.' });
                return;
            }
            let updatedTask;
            if (membership.role && membership.role.name === ProjectMember_entity_1.ProjectRoleName.TEAM_MEMBER) {
                // Team member: status-only update with ownership verification
                updatedTask = await task_service_1.taskService.updateStatus(taskId, req.body.status, req.user.id);
            }
            else {
                // Admin/PM: full update
                updatedTask = await task_service_1.taskService.update(taskId, req.body);
            }
            res.status(200).json({ task: updatedTask });
        }
        catch (error) {
            res.status(error.status || 500).json({ error: error.message || 'Failed to update task.' });
        }
    },
    async delete(req, res) {
        try {
            if (!req.user) {
                res.status(401).json({ error: 'Authentication required.' });
                return;
            }
            const taskId = req.params.id;
            const task = await task_service_1.taskService.findById(taskId);
            const membership = await memberRepo().findOne({
                where: { projectId: task.projectId, userId: req.user.id },
                relations: { role: true },
            });
            if (!membership || !membership.role || (membership.role.name !== ProjectMember_entity_1.ProjectRoleName.ADMIN && membership.role.name !== ProjectMember_entity_1.ProjectRoleName.PROJECT_MANAGER)) {
                res.status(403).json({
                    error: 'Forbidden',
                    message: 'Only project admins and project managers can delete tasks.',
                });
                return;
            }
            await task_service_1.taskService.delete(taskId);
            res.status(200).json({ message: 'Task deleted successfully.' });
        }
        catch (error) {
            res.status(error.status || 500).json({ error: error.message || 'Failed to delete task.' });
        }
    },
};
