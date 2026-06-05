"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.projectController = void 0;
const project_service_1 = require("../services/project.service");
exports.projectController = {
    async getAll(req, res) {
        try {
            const projects = await project_service_1.projectService.findAll();
            res.status(200).json({ projects });
        }
        catch (error) {
            res.status(error.status || 500).json({ error: error.message || 'Failed to fetch projects.' });
        }
    },
    async getById(req, res) {
        try {
            const project = await project_service_1.projectService.findById(req.params.id);
            res.status(200).json({ project });
        }
        catch (error) {
            res.status(error.status || 500).json({ error: error.message || 'Failed to fetch project.' });
        }
    },
    async create(req, res) {
        try {
            const project = await project_service_1.projectService.create({
                ...req.body,
                ownerId: req.user.id,
            });
            res.status(201).json({ project });
        }
        catch (error) {
            res.status(error.status || 500).json({ error: error.message || 'Failed to create project.' });
        }
    },
    async update(req, res) {
        try {
            const project = await project_service_1.projectService.update(req.params.id, req.body);
            res.status(200).json({ project });
        }
        catch (error) {
            res.status(error.status || 500).json({ error: error.message || 'Failed to update project.' });
        }
    },
    async delete(req, res) {
        try {
            await project_service_1.projectService.delete(req.params.id);
            res.status(200).json({ message: 'Project deleted successfully.' });
        }
        catch (error) {
            res.status(error.status || 500).json({ error: error.message || 'Failed to delete project.' });
        }
    },
};
