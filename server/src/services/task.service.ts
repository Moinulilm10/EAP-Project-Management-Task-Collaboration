import { AppDataSource } from '../utils/data-source';
import { Task, TaskStatus, TaskPriority } from '../entities/Task.entity';
import { ProjectRoleName } from '../entities/ProjectMember.entity';
import { TaskTeam } from '../entities/TaskTeam.entity';

const repo = () => AppDataSource.getRepository(Task);

export const taskService = {
  async findAll(
    userId: string,
    options?: {
      search?: string;
      status?: TaskStatus;
      priority?: TaskPriority;
      page?: number;
      limit?: number;
    }
  ): Promise<{ tasks: Task[]; total: number }> {
    const page = options?.page || 1;
    const limit = options?.limit || 10;
    const skip = (page - 1) * limit;

    const query = repo()
      .createQueryBuilder('task')
      .leftJoinAndSelect('task.assignee', 'assignee')
      .leftJoinAndSelect('task.createdBy', 'createdBy')
      .leftJoinAndSelect('task.project', 'project')
      .leftJoinAndSelect('task.taskTeams', 'taskTeam')
      .leftJoinAndSelect('taskTeam.team', 'team')
      .innerJoin('project.projectMembers', 'pm', 'pm.userId = :userId', { userId })
      .innerJoin('pm.role', 'role')
      .where(
        '(role.name IN (:...allAccessRoles) OR task.assigneeId = :userId)',
        {
          userId,
          allAccessRoles: [ProjectRoleName.ADMIN, ProjectRoleName.PROJECT_MANAGER],
        }
      );

    if (options?.search) {
      query.andWhere(
        '(task.title ILIKE :search OR task.description ILIKE :search)',
        { search: `%${options.search}%` }
      );
    }
    if (options?.status && options.status !== ('all' as any)) {
      query.andWhere('task.status = :status', { status: options.status });
    }
    if (options?.priority && options.priority !== ('all' as any)) {
      query.andWhere('task.priority = :priority', { priority: options.priority });
    }

    query.orderBy('task.createdAt', 'DESC')
         .skip(skip)
         .take(limit);

    const [tasks, total] = await query.getManyAndCount();
    return { tasks, total };
  },

  async findById(id: string): Promise<Task> {
    const task = await repo().findOne({
      where: { id },
      relations: { assignee: true, createdBy: true, project: true, taskTeams: { team: true } },
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
    teamId?: string | null;
  }): Promise<Task> {
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const task = queryRunner.manager.create(Task, {
        title: data.title,
        description: data.description || null,
        priority: data.priority || TaskPriority.MEDIUM,
        status: data.status || TaskStatus.TODO,
        assigneeId: data.assigneeId || null,
        projectId: data.projectId,
        dueDate: data.dueDate ? new Date(data.dueDate) : null,
        createdById: data.createdById,
      });
      const savedTask = await queryRunner.manager.save(task);

      if (data.teamId) {
        const taskTeam = queryRunner.manager.create(TaskTeam, {
          taskId: savedTask.id,
          teamId: data.teamId,
        });
        await queryRunner.manager.save(taskTeam);
      }

      await queryRunner.commitTransaction();
      return await this.findById(savedTask.id);
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
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
      teamId: string | null;
    }>
  ): Promise<Task> {
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const task = await queryRunner.manager.findOne(Task, { where: { id } });
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

      await queryRunner.manager.save(task);

      if (data.teamId !== undefined) {
        await queryRunner.manager.delete(TaskTeam, { taskId: task.id });
        if (data.teamId !== null) {
          const taskTeam = queryRunner.manager.create(TaskTeam, {
            taskId: task.id,
            teamId: data.teamId,
          });
          await queryRunner.manager.save(taskTeam);
        }
      }

      await queryRunner.commitTransaction();
      return await this.findById(task.id);
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
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
