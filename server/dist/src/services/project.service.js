"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.projectService = void 0;
const data_source_1 = require("../utils/data-source");
const Project_entity_1 = require("../entities/Project.entity");
const repo = () => data_source_1.AppDataSource.getRepository(Project_entity_1.Project);
exports.projectService = {
    async findAll() {
        return repo().find({
            relations: { owner: true },
            order: { createdAt: 'DESC' },
        });
    },
    async findById(id) {
        const project = await repo().findOne({
            where: { id },
            relations: { owner: true, tasks: true },
        });
        if (!project) {
            throw { status: 404, message: 'Project not found.' };
        }
        return project;
    },
    async create(data) {
        const project = repo().create({
            name: data.name,
            description: data.description || null,
            deadline: data.deadline ? new Date(data.deadline) : null,
            status: data.status || Project_entity_1.ProjectStatus.ACTIVE,
            ownerId: data.ownerId,
        });
        return repo().save(project);
    },
    async update(id, data) {
        const project = await repo().findOne({ where: { id } });
        if (!project) {
            throw { status: 404, message: 'Project not found.' };
        }
        if (data.name !== undefined)
            project.name = data.name;
        if (data.description !== undefined)
            project.description = data.description;
        if (data.deadline !== undefined) {
            project.deadline = data.deadline ? new Date(data.deadline) : null;
        }
        if (data.status !== undefined)
            project.status = data.status;
        if (data.progress !== undefined)
            project.progress = data.progress;
        return repo().save(project);
    },
    async delete(id) {
        const project = await repo().findOne({ where: { id } });
        if (!project) {
            throw { status: 404, message: 'Project not found.' };
        }
        await repo().remove(project);
    },
};
