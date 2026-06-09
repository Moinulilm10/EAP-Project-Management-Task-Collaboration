import { IsNull } from "typeorm";
import { Project, ProjectStatus } from "../entities/Project.entity";
import {
  ProjectMember,
  ProjectRoleName,
} from "../entities/ProjectMember.entity";
import { Role } from "../entities/Role.entity";
import { Activity } from "../entities/Activity.entity";
import { AppDataSource } from "../utils/data-source";

const projectRepo = () => AppDataSource.getRepository(Project);
const memberRepo = () => AppDataSource.getRepository(ProjectMember);

export interface ProjectQueryOptions {
  status?: ProjectStatus | "active" | "completed" | "on_hold";
  search?: string;
  page?: number;
  limit?: number;
  userId?: string;
  adminOnly?: boolean;
  sortBy?: string;
  deadlineStatus?: 'upcoming' | 'overdue' | 'all';
}

export interface ProjectSummary {
  id: string;
  name: string;
  description: string | null;
  status: ProjectStatus;
  progress: number;
  deadline: string | null;
  createdAt: string;
  updatedAt: string;
  owner: {
    id: string;
    name: string;
    email: string;
  };
  memberCount: number;
  currentUserRole?: string;
}

export interface ProjectPaginationResponse {
  projects: ProjectSummary[];
  total: number;
}

export const projectService = {
  async findAll(
    filters: ProjectQueryOptions = {},
  ): Promise<ProjectPaginationResponse> {
    const query = projectRepo()
      .createQueryBuilder("project")
      .leftJoin("project.owner", "owner")
      .leftJoin("project.projectMembers", "member")
      .leftJoin(
        "project.projectMembers",
        "currentUserMember",
        "currentUserMember.userId = :requestingUserId",
        { requestingUserId: filters.userId || "" }
      )
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
      query.andWhere(
        "(LOWER(project.name) LIKE :search OR LOWER(project.description) LIKE :search)",
        { search },
      );
    }

    if (filters.adminOnly) {
      query.andWhere("currentUserRoleRelation.name = :adminRoleName", {
        adminRoleName: ProjectRoleName.ADMIN,
      });
    }

    if (filters.deadlineStatus && filters.deadlineStatus !== 'all') {
      const today = new Date();
      today.setHours(0,0,0,0);
      if (filters.deadlineStatus === 'overdue') {
        query.andWhere('project.deadline < :today AND project.status != :completed', { today, completed: ProjectStatus.COMPLETED });
      } else if (filters.deadlineStatus === 'upcoming') {
        query.andWhere('project.deadline >= :today AND project.status != :completed', { today, completed: ProjectStatus.COMPLETED });
      }
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
      .addSelect("COUNT(DISTINCT member.id)", "memberCount")
      .addSelect((qb) => {
        return qb
          .select("COUNT(attachment.id)", "count")
          .from("attachments", "attachment")
          .where('attachment."projectId" = project.id');
      }, "attachmentCount")
      .groupBy("project.id")
      .addGroupBy("owner.id")
      .addGroupBy("currentUserRoleRelation.name");

    if (filters.sortBy) {
      switch (filters.sortBy) {
        case 'dueDate_asc':
          query.orderBy("project.deadline IS NULL", "ASC");
          query.addOrderBy("project.deadline", "ASC");
          break;
        case 'updatedAt_desc':
          query.orderBy("project.updatedAt", "DESC");
          break;
        case 'createdAt_desc':
        default:
          query.orderBy("project.createdAt", "DESC");
          break;
      }
    } else {
      query.orderBy("project.createdAt", "DESC");
    }

    // Optimized total count (distinct projects matching filters)
    const countQuery = projectRepo()
      .createQueryBuilder("project")
      .leftJoin("project.owner", "owner")
      .leftJoin("project.projectMembers", "member")
      .leftJoin(
        "project.projectMembers",
        "currentUserMember",
        "currentUserMember.userId = :requestingUserId",
        { requestingUserId: filters.userId || "" }
      )
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
      countQuery.andWhere(
        "(LOWER(project.name) LIKE :search OR LOWER(project.description) LIKE :search)",
        { search },
      );
    }

    if (filters.adminOnly) {
      countQuery.andWhere("currentUserRoleRelation.name = :adminRoleName", {
        adminRoleName: ProjectRoleName.ADMIN,
      });
    }

    if (filters.deadlineStatus && filters.deadlineStatus !== 'all') {
      const today = new Date();
      today.setHours(0,0,0,0);
      if (filters.deadlineStatus === 'overdue') {
        countQuery.andWhere('project.deadline < :today AND project.status != :completed', { today, completed: ProjectStatus.COMPLETED });
      } else if (filters.deadlineStatus === 'upcoming') {
        countQuery.andWhere('project.deadline >= :today AND project.status != :completed', { today, completed: ProjectStatus.COMPLETED });
      }
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
      projects: raw.map((row: any) => ({
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
        attachmentCount: Number(row.attachmentCount) || 0,
        currentUserRole: row.currentUserRoleRelation_name || undefined,
      })),
      total,
    };
  },

  async findById(id: string): Promise<Project> {
    const project = await projectRepo().findOne({
      where: { id, deletedAt: IsNull() },
      relations: { owner: true, projectMembers: true, tasks: true },
    });

    if (!project) {
      throw { status: 404, message: "Project not found." };
    }

    return project;
  },

  async create(data: {
    name: string;
    description?: string | null;
    deadline?: string | null;
    status?: ProjectStatus;
    ownerId: string;
  }): Promise<Project> {
    return AppDataSource.manager.transaction(async (manager) => {
      const project = manager.create(Project, {
        name: data.name,
        description: data.description || null,
        deadline: data.deadline ? new Date(data.deadline) : null,
        status: data.status || ProjectStatus.ACTIVE,
        ownerId: data.ownerId,
      });

      const savedProject = await manager.save(project);

      const adminRole = await manager.findOneBy(Role, { name: ProjectRoleName.ADMIN });
      if (!adminRole) {
        throw new Error("Admin role not found in database.");
      }

      const membership = manager.create(ProjectMember, {
        project: savedProject,
        userId: data.ownerId,
        roleId: adminRole.id,
      });

      await manager.save(membership);

      const activity = manager.create(Activity, {
        user: `Project “${savedProject.name}”`,
        action: "created",
        target: "",
        status: "",
      });
      await manager.save(activity);

      return savedProject;
    });
  },

  async update(
    id: string,
    data: Partial<{
      name: string;
      description: string | null;
      deadline: string | null;
      status: ProjectStatus;
      progress: number;
    }>,
    requesterId: string,
  ): Promise<Project> {
    const project = await projectRepo().findOne({
      where: { id, deletedAt: IsNull() },
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

    const isAdmin = membership?.role?.name === ProjectRoleName.ADMIN;

    if (!isAdmin) {
      throw {
        status: 403,
        message: "Project update requires project admin membership.",
      };
    }

    if (data.name !== undefined) project.name = data.name;
    if (data.description !== undefined) project.description = data.description;
    if (data.deadline !== undefined) {
      project.deadline = data.deadline ? new Date(data.deadline) : null;
    }
    if (data.status !== undefined) project.status = data.status;
    if (data.progress !== undefined) project.progress = data.progress;

    return projectRepo().save(project);
  },

  async delete(id: string, requesterId: string): Promise<void> {
    const project = await projectRepo().findOne({
      where: { id, deletedAt: IsNull() },
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

    const isAdmin = membership?.role?.name === ProjectRoleName.ADMIN;

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
