import { AppDataSource } from '../utils/data-source';
import { Task, TaskStatus, TaskPriority } from '../entities/Task.entity';
import { UserRole } from '../entities/User.entity';

const repo = () => AppDataSource.getRepository(Task);

export const taskService = {
  async findAll(userId: string, userRole: UserRole): Promise<Task[]> {
    const qb = repo()
      .createQueryBuilder('task')
      .leftJoinAndSelect('task.assignee', 'assignee')
      .leftJoinAndSelect('task.createdBy', 'createdBy')
      .leftJoinAndSelect('task.project', 'project')
      .orderBy('task.createdAt', 'DESC');

    // Team members only see tasks assigned to them
    if (userRole === UserRole.TEAM_MEMBER) {
      qb.where('task.assigneeId = :userId', { userId });
    }

    return qb.getMany();
  },

  async findById(id: string): Promise<Task> {
    const task = await repo().findOne({
      where: { id },
      relations: { assignee: true, createdBy: true, project: true },
    });
    if (!task) {
      throw { status: 404, message: 'Task not found.' };
    }
    return task;
  },

  async findByProject(projectId: string): Promise<Task[]> {
    return repo().find({
      where: { projectId },
      relations: { assignee: true, createdBy: true },
      order: { createdAt: 'DESC' },
    });
  },

  async create(data: {
    title: string;
    description?: string | null;
    priority?: TaskPriority;
    status?: TaskStatus;
    assigneeId?: string | null;
    projectId: string;
    dueDate?: string | null;
    createdById: string;
  }): Promise<Task> {
    const task = repo().create({
      title: data.title,
      description: data.description || null,
      priority: data.priority || TaskPriority.MEDIUM,
      status: data.status || TaskStatus.TODO,
      assigneeId: data.assigneeId || null,
      projectId: data.projectId,
      dueDate: data.dueDate ? new Date(data.dueDate) : null,
      createdById: data.createdById,
    });
    return repo().save(task);
  },

  /**
   * Full update: Admin and PM can update all fields.
   */
  async update(
    id: string,
    data: Partial<{
      title: string;
      description: string | null;
      priority: TaskPriority;
      status: TaskStatus;
      assigneeId: string | null;
      dueDate: string | null;
    }>
  ): Promise<Task> {
    const task = await repo().findOne({ where: { id } });
    if (!task) {
      throw { status: 404, message: 'Task not found.' };
    }

    if (data.title !== undefined) task.title = data.title;
    if (data.description !== undefined) task.description = data.description;
    if (data.priority !== undefined) task.priority = data.priority;
    if (data.status !== undefined) task.status = data.status;
    if (data.assigneeId !== undefined) task.assigneeId = data.assigneeId;
    if (data.dueDate !== undefined) {
      task.dueDate = data.dueDate ? new Date(data.dueDate) : null;
    }

    return repo().save(task);
  },

  /**
   * Status-only update: Team Members can only change task status on tasks assigned to them.
   */
  async updateStatus(
    taskId: string,
    status: TaskStatus,
    userId: string
  ): Promise<Task> {
    const task = await repo().findOne({ where: { id: taskId } });
    if (!task) {
      throw { status: 404, message: 'Task not found.' };
    }

    // Verify the team member is the assignee
    if (task.assigneeId !== userId) {
      throw {
        status: 403,
        message: 'Team members can only update the status of tasks assigned to them.',
      };
    }

    task.status = status;
    return repo().save(task);
  },

  async delete(id: string): Promise<void> {
    const task = await repo().findOne({ where: { id } });
    if (!task) {
      throw { status: 404, message: 'Task not found.' };
    }
    await repo().remove(task);
  },
};
