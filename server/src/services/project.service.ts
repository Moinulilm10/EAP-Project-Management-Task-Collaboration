import { AppDataSource } from '../utils/data-source';
import { Project, ProjectStatus } from '../entities/Project.entity';

const repo = () => AppDataSource.getRepository(Project);

export const projectService = {
  async findAll(): Promise<Project[]> {
    return repo().find({
      relations: { owner: true },
      order: { createdAt: 'DESC' },
    });
  },

  async findById(id: string): Promise<Project> {
    const project = await repo().findOne({
      where: { id },
      relations: { owner: true, tasks: true },
    });
    if (!project) {
      throw { status: 404, message: 'Project not found.' };
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
    const project = repo().create({
      name: data.name,
      description: data.description || null,
      deadline: data.deadline ? new Date(data.deadline) : null,
      status: data.status || ProjectStatus.ACTIVE,
      ownerId: data.ownerId,
    });
    return repo().save(project);
  },

  async update(
    id: string,
    data: Partial<{
      name: string;
      description: string | null;
      deadline: string | null;
      status: ProjectStatus;
      progress: number;
    }>
  ): Promise<Project> {
    const project = await repo().findOne({ where: { id } });
    if (!project) {
      throw { status: 404, message: 'Project not found.' };
    }

    if (data.name !== undefined) project.name = data.name;
    if (data.description !== undefined) project.description = data.description;
    if (data.deadline !== undefined) {
      project.deadline = data.deadline ? new Date(data.deadline) : null;
    }
    if (data.status !== undefined) project.status = data.status;
    if (data.progress !== undefined) project.progress = data.progress;

    return repo().save(project);
  },

  async delete(id: string): Promise<void> {
    const project = await repo().findOne({ where: { id } });
    if (!project) {
      throw { status: 404, message: 'Project not found.' };
    }
    await repo().remove(project);
  },
};
