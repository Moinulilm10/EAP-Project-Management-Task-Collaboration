"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.projectService = void 0;
const typeorm_1 = require("typeorm");
const Project_entity_1 = require("../entities/Project.entity");
const ProjectMember_entity_1 = require("../entities/ProjectMember.entity");
const Role_entity_1 = require("../entities/Role.entity");
const data_source_1 = require("../utils/data-source");
const projectRepo = () => data_source_1.AppDataSource.getRepository(Project_entity_1.Project);
const memberRepo = () => data_source_1.AppDataSource.getRepository(ProjectMember_entity_1.ProjectMember);
exports.projectService = {
    async findAll(filters = {}) {
        const query = projectRepo()
            .createQueryBuilder("project")
            .leftJoin("project.owner", "owner")
            .leftJoin("project.projectMembers", "member")
            .leftJoin("project.projectMembers", "currentUserMember", "currentUserMember.userId = :requestingUserId", { requestingUserId: filters.userId || "" })
            .leftJoin("currentUserMember.role", "currentUserRoleRelation")
            .where("project.deletedAt IS NULL")
            .andWhere("owner.id IS NOT NULL");
        // If userId provided, only return projects where the user is owner or a member
        if (filters.userId) {
            query.andWhere("(owner.id = :userId OR member.userId = :userId)", {
                userId: filters.userId,
            });
        }
        if (filters.status) {
            query.andWhere("project.status = :status", { status: filters.status });
        }
        if (filters.search) {
            const search = `%${filters.search.toLowerCase()}%`;
            query.andWhere("(LOWER(project.name) LIKE :search OR LOWER(project.description) LIKE :search)", { search });
        }
        if (filters.adminOnly) {
            query.andWhere("currentUserRoleRelation.name = :adminRoleName", {
                adminRoleName: ProjectMember_entity_1.ProjectRoleName.ADMIN,
            });
        }
        query
            .select([
            "project.id",
            "project.name",
            "project.description",
            "project.status",
            "project.progress",
            "project.deadline",
            "project.createdAt",
            "project.updatedAt",
            "owner.id",
            "owner.name",
            "owner.email",
            "currentUserRoleRelation.name",
        ])
            .addSelect("COUNT(member.id)", "memberCount")
            .groupBy("project.id")
            .addGroupBy("owner.id")
            .addGroupBy("currentUserRoleRelation.name")
            .orderBy("project.createdAt", "DESC");
        // Optimized total count (distinct projects matching filters)
        const countQuery = projectRepo()
            .createQueryBuilder("project")
            .leftJoin("project.owner", "owner")
            .leftJoin("project.projectMembers", "member")
            .leftJoin("project.projectMembers", "currentUserMember", "currentUserMember.userId = :requestingUserId", { requestingUserId: filters.userId || "" })
            .leftJoin("currentUserMember.role", "currentUserRoleRelation")
            .where("project.deletedAt IS NULL")
            .andWhere("owner.id IS NOT NULL");
        if (filters.userId) {
            countQuery.andWhere("(owner.id = :userId OR member.userId = :userId)", {
                userId: filters.userId,
            });
        }
        if (filters.status) {
            countQuery.andWhere("project.status = :status", {
                status: filters.status,
            });
        }
        if (filters.search) {
            const search = `%${filters.search.toLowerCase()}%`;
            countQuery.andWhere("(LOWER(project.name) LIKE :search OR LOWER(project.description) LIKE :search)", { search });
        }
        if (filters.adminOnly) {
            countQuery.andWhere("currentUserRoleRelation.name = :adminRoleName", {
                adminRoleName: ProjectMember_entity_1.ProjectRoleName.ADMIN,
            });
        }
        // Use DISTINCT count to avoid duplicates from joins
        const totalRaw = await countQuery
            .select("COUNT(DISTINCT project.id)", "total")
            .getRawOne();
        const total = Number(totalRaw?.total || 0);
        const page = filters.page ?? 1;
        if (filters.limit != null) {
            query.skip((page - 1) * filters.limit).take(filters.limit);
        }
        const raw = await query.getRawMany();
        return {
            projects: raw.map((row) => ({
                id: row.project_id,
                name: row.project_name,
                description: row.project_description,
                status: row.project_status,
                progress: Number(row.project_progress),
                deadline: row.project_deadline
                    ? new Date(row.project_deadline).toISOString()
                    : null,
                createdAt: new Date(row.project_createdAt).toISOString(),
                updatedAt: new Date(row.project_updatedAt).toISOString(),
                owner: {
                    id: row.owner_id,
                    name: row.owner_name,
                    email: row.owner_email,
                },
                memberCount: Number(row.memberCount) || 0,
                currentUserRole: row.currentUserRoleRelation_name || undefined,
            })),
            total,
        };
    },
    async findById(id) {
        const project = await projectRepo().findOne({
            where: { id, deletedAt: (0, typeorm_1.IsNull)() },
            relations: { owner: true, projectMembers: true, tasks: true },
        });
        if (!project) {
            throw { status: 404, message: "Project not found." };
        }
        return project;
    },
    async create(data) {
        return data_source_1.AppDataSource.manager.transaction(async (manager) => {
            const project = manager.create(Project_entity_1.Project, {
                name: data.name,
                description: data.description || null,
                deadline: data.deadline ? new Date(data.deadline) : null,
                status: data.status || Project_entity_1.ProjectStatus.ACTIVE,
                ownerId: data.ownerId,
            });
            const savedProject = await manager.save(project);
            const adminRole = await manager.findOneBy(Role_entity_1.Role, { name: ProjectMember_entity_1.ProjectRoleName.ADMIN });
            if (!adminRole) {
                throw new Error("Admin role not found in database.");
            }
            const membership = manager.create(ProjectMember_entity_1.ProjectMember, {
                project: savedProject,
                userId: data.ownerId,
                roleId: adminRole.id,
            });
            await manager.save(membership);
            return savedProject;
        });
    },
    async update(id, data, requesterId) {
        const project = await projectRepo().findOne({
            where: { id, deletedAt: (0, typeorm_1.IsNull)() },
        });
        if (!project) {
            throw { status: 404, message: "Project not found." };
        }
        // Only project admin can update
        const membership = await memberRepo().findOne({
            where: {
                projectId: project.id,
                userId: requesterId,
            },
            relations: { role: true },
        });
        const isAdmin = membership?.role?.name === ProjectMember_entity_1.ProjectRoleName.ADMIN;
        if (!isAdmin) {
            throw {
                status: 403,
                message: "Project update requires project admin membership.",
            };
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
        return projectRepo().save(project);
    },
    async delete(id, requesterId) {
        const project = await projectRepo().findOne({
            where: { id, deletedAt: (0, typeorm_1.IsNull)() },
        });
        if (!project) {
            throw { status: 404, message: "Project not found." };
        }
        // Only project admin can delete
        const membership = await memberRepo().findOne({
            where: {
                projectId: project.id,
                userId: requesterId,
            },
            relations: { role: true },
        });
        const isAdmin = membership?.role?.name === ProjectMember_entity_1.ProjectRoleName.ADMIN;
        if (!isAdmin) {
            throw {
                status: 403,
                message: "Project deletion requires project admin membership.",
            };
        }
        project.deletedAt = new Date();
        await projectRepo().save(project);
    },
};
