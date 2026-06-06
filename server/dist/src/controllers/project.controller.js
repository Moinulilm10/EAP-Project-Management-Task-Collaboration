"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.projectController = void 0;
const project_service_1 = require("../services/project.service");
const isValidProjectStatus = (value) => value === "active" || value === "completed" || value === "on_hold";
exports.projectController = {
    async getAll(req, res) {
        try {
            const statusQuery = req.query.status;
            const filters = {
                status: isValidProjectStatus(statusQuery) ? statusQuery : undefined,
                search: req.query.search,
                page: req.query.page ? Number(req.query.page) : undefined,
                limit: req.query.limit ? Number(req.query.limit) : undefined,
                adminOnly: req.query.adminOnly === "true",
                userId: req.user?.id,
            };
            const result = await project_service_1.projectService.findAll(filters);
            res.status(200).json(result);
        }
        catch (error) {
            res
                .status(error.status || 500)
                .json({ error: error.message || "Failed to fetch projects." });
        }
    },
    async getById(req, res) {
        try {
            const project = await project_service_1.projectService.findById(req.params.id);
            res.status(200).json({ project });
        }
        catch (error) {
            res
                .status(error.status || 500)
                .json({ error: error.message || "Failed to fetch project." });
        }
    },
    async create(req, res) {
        try {
            if (!req.user) {
                res.status(401).json({ error: "Authentication required." });
                return;
            }
            const project = await project_service_1.projectService.create({
                ...req.body,
                ownerId: req.user.id,
            });
            res.status(201).json({ project });
        }
        catch (error) {
            res
                .status(error.status || 500)
                .json({ error: error.message || "Failed to create project." });
        }
    },
    async update(req, res) {
        try {
            if (!req.user) {
                res.status(401).json({ error: "Authentication required." });
                return;
            }
            const project = await project_service_1.projectService.update(req.params.id, req.body, req.user.id);
            res.status(200).json({ project });
        }
        catch (error) {
            res
                .status(error.status || 500)
                .json({ error: error.message || "Failed to update project." });
        }
    },
    async delete(req, res) {
        try {
            if (!req.user) {
                res.status(401).json({ error: "Authentication required." });
                return;
            }
            await project_service_1.projectService.delete(req.params.id, req.user.id);
            res.status(200).json({ message: "Project deleted successfully." });
        }
        catch (error) {
            res
                .status(error.status || 500)
                .json({ error: error.message || "Failed to delete project." });
        }
    },
};
