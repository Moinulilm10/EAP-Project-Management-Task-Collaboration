import { IsNull } from "typeorm";
import { Project, ProjectStatus } from "../entities/Project.entity";
import {
  ProjectMember,
  ProjectMemberRole,
} from "../entities/ProjectMember.entity";
import { UserRole } from "../entities/User.entity";
import { AppDataSource } from "../utils/data-source";

const projectRepo = () => AppDataSource.getRepository(Project);
const memberRepo = () => AppDataSource.getRepository(ProjectMember);

export interface ProjectQueryOptions {
  status?: ProjectStatus | "active" | "completed" | "on_hold";
  search?: string;
  page?: number;
  limit?: number;
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
      .where("project.deletedAt IS NULL")
      .andWhere("owner.id IS NOT NULL");

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
      ])
      .addSelect("COUNT(member.id)", "memberCount")
      .groupBy("project.id")
      .addGroupBy("owner.id")
      .orderBy("project.createdAt", "DESC");

    const total = await projectRepo()
      .createQueryBuilder("project")
      .leftJoin("project.owner", "owner")
      .leftJoin("project.projectMembers", "member")
      .where("project.deletedAt IS NULL")
      .andWhere(filters.status ? "project.status = :status" : "1=1", {
        status: filters.status,
      })
      .andWhere(
        filters.search
          ? "(LOWER(project.name) LIKE :search OR LOWER(project.description) LIKE :search)"
          : "1=1",
        {
          search: filters.search
            ? `%${filters.search.toLowerCase()}%`
            : undefined,
        },
      )
      .groupBy("project.id")
      .getCount();

    if (filters.page && filters.limit) {
      query.skip((filters.page - 1) * filters.limit).take(filters.limit);
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

      const membership = manager.create(ProjectMember, {
        project: savedProject,
        userId: data.ownerId,
        role: ProjectMemberRole.ADMIN,
      });

      await manager.save(membership);
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
    requesterRole: UserRole,
  ): Promise<Project> {
    const project = await projectRepo().findOne({
      where: { id, deletedAt: IsNull() },
    });
    if (!project) {
      throw { status: 404, message: "Project not found." };
    }

    if (requesterRole !== UserRole.ADMIN) {
      const isAdmin = await memberRepo().count({
        where: {
          projectId: project.id,
          userId: requesterId,
          role: ProjectMemberRole.ADMIN,
        },
      });

      if (!isAdmin) {
        throw {
          status: 403,
          message: "Project update requires project admin membership.",
        };
      }
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

  async delete(
    id: string,
    requesterId: string,
    requesterRole: UserRole,
  ): Promise<void> {
    const project = await projectRepo().findOne({
      where: { id, deletedAt: IsNull() },
    });
    if (!project) {
      throw { status: 404, message: "Project not found." };
    }

    if (requesterRole !== UserRole.ADMIN) {
      const isAdmin = await memberRepo().count({
        where: {
          projectId: project.id,
          userId: requesterId,
          role: ProjectMemberRole.ADMIN,
        },
      });

      if (!isAdmin) {
        throw {
          status: 403,
          message: "Project deletion requires project admin membership.",
        };
      }
    }

    project.deletedAt = new Date();
    await projectRepo().save(project);
  },
};
