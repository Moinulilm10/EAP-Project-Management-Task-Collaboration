import { AppDataSource } from '../utils/data-source';
import { Project, ProjectStatus } from '../entities/Project.entity';
import { Task, TaskStatus, TaskPriority } from '../entities/Task.entity';
import { User } from '../entities/User.entity';
import { Activity } from '../entities/Activity.entity';
import { LessThan, MoreThanOrEqual, Not, In } from 'typeorm';

export interface ProjectSummary {
  id: string;
  title: string;
  progress: number;
  dueDate: string | null;
  status: 'active' | 'completed' | 'on-hold';
  isWarning?: boolean;
  tasksPending: number;
  tasksCompleted: number;
  totalTasks: number;
}

export class DashboardService {
  private projectRepo = AppDataSource.getRepository(Project);
  private taskRepo = AppDataSource.getRepository(Task);
  private userRepo = AppDataSource.getRepository(User);

  async getInsights() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // 1. Fetch all tasks to compute distribution locally (faster than many queries if DB is not massive,
    // or we can use QueryBuilder for aggregates. Using QueryBuilder is better for scalability.)
    const qb = this.taskRepo.createQueryBuilder('task');
    
    // Status Distribution
    const statusCounts = await qb
      .select('task.status', 'status')
      .addSelect('COUNT(task.id)', 'count')
      .groupBy('task.status')
      .getRawMany();

    const tasksByStatus = {
      todo: parseInt(statusCounts.find((s) => s.status === TaskStatus.TODO)?.count || '0', 10),
      inProgress: parseInt(statusCounts.find((s) => s.status === TaskStatus.IN_PROGRESS)?.count || '0', 10),
      review: parseInt(statusCounts.find((s) => s.status === TaskStatus.REVIEW)?.count || '0', 10),
      done: parseInt(statusCounts.find((s) => s.status === TaskStatus.DONE)?.count || '0', 10),
    };

    // Priority Distribution
    const priorityCounts = await qb
      .select('task.priority', 'priority')
      .addSelect('COUNT(task.id)', 'count')
      .groupBy('task.priority')
      .getRawMany();

    const tasksByPriority = {
      low: parseInt(priorityCounts.find((p) => p.priority === TaskPriority.LOW)?.count || '0', 10),
      medium: parseInt(priorityCounts.find((p) => p.priority === TaskPriority.MEDIUM)?.count || '0', 10),
      high: parseInt(priorityCounts.find((p) => p.priority === TaskPriority.HIGH)?.count || '0', 10),
      critical: parseInt(priorityCounts.find((p) => p.priority === TaskPriority.CRITICAL)?.count || '0', 10),
    };

    const totalTasks = tasksByStatus.todo + tasksByStatus.inProgress + tasksByStatus.review + tasksByStatus.done;
    const completedTasks = tasksByStatus.done;
    const pendingTasks = totalTasks - completedTasks;

    const totalProjects = await this.projectRepo.count();
    const overdueTasks = await this.taskRepo.count({
      where: { dueDate: LessThan(today), status: Not(TaskStatus.DONE) },
    });

    // 2. High Priority Tasks (HIGH/CRITICAL, not done)
    const rawHighPriorityTasks = await this.taskRepo.find({
      where: {
        priority: In([TaskPriority.HIGH, TaskPriority.CRITICAL]),
        status: Not(TaskStatus.DONE),
      },
      order: { dueDate: 'ASC' },
      take: 5,
      relations: { project: true, assignee: true },
    });

    const highPriorityTasks = rawHighPriorityTasks.map((t) => ({
      id: t.id,
      title: t.title,
      project: t.project?.name || 'Unknown Project',
      dueDate: t.dueDate ? t.dueDate.toISOString() : null,
      priority: t.priority,
      isOverdue: t.dueDate ? new Date(t.dueDate) < today : false,
      assigneeInitials: t.assignee ? t.assignee.name.substring(0, 2).toUpperCase() : 'U',
    }));

    // 3. Upcoming Deadlines (Due >= today, not done)
    const rawUpcomingDeadlines = await this.taskRepo.find({
      where: {
        dueDate: MoreThanOrEqual(today),
        status: Not(TaskStatus.DONE),
      },
      order: { dueDate: 'ASC' },
      take: 5,
      relations: { project: true, assignee: true },
    });

    const upcomingDeadlines = rawUpcomingDeadlines.map((t) => ({
      id: t.id,
      title: t.title,
      project: t.project?.name || 'Unknown Project',
      dueDate: t.dueDate ? t.dueDate.toISOString() : null,
      priority: t.priority,
      assigneeInitials: t.assignee ? t.assignee.name.substring(0, 2).toUpperCase() : 'U',
    }));

    // 4. Recent Activities from Database
    const activityRepo = AppDataSource.getRepository(Activity);
    const dbActivities = await activityRepo.find({
      order: { createdAt: 'DESC' },
      take: 10,
    });

    const recentActivities = dbActivities.map((a) => ({
      id: a.id,
      user: a.user,
      action: a.action,
      target: a.target,
      time: a.createdAt.toISOString(),
      status: a.status,
    }));

    // 5. Member Workload Summary
    const workloadCounts = await this.taskRepo.createQueryBuilder('task')
      .select('task.assigneeId', 'assigneeId')
      .addSelect('COUNT(task.id)', 'count')
      .where('task.status != :status', { status: TaskStatus.DONE })
      .andWhere('task.assigneeId IS NOT NULL')
      .groupBy('task.assigneeId')
      .getRawMany();

    const memberWorkload = await Promise.all(workloadCounts.map(async (w) => {
      const user = await this.userRepo.findOne({ where: { id: w.assigneeId } });
      return {
        userId: w.assigneeId,
        userName: user ? user.name : 'Unknown User',
        userInitials: user ? user.name.substring(0, 2).toUpperCase() : 'U',
        taskCount: parseInt(w.count, 10),
      };
    }));

    // 6. Project Summaries
    const projects = await this.projectRepo.find({
      where: { status: ProjectStatus.ACTIVE },
      order: { updatedAt: 'DESC' },
      take: 5,
    });

    const projectSummaries: ProjectSummary[] = await Promise.all(
      projects.map(async (p) => {
        const pTasks = await this.taskRepo.find({ where: { projectId: p.id } });
        const pTotal = pTasks.length;
        const pCompleted = pTasks.filter((t) => t.status === TaskStatus.DONE).length;
        const pPending = pTotal - pCompleted;
        const progress = pTotal > 0 ? Math.round((pCompleted / pTotal) * 100) : 0;

        let isWarning = false;
        if (p.deadline) {
          const deadlineDate = new Date(p.deadline);
          deadlineDate.setHours(0,0,0,0);
          const daysUntilDeadline = Math.floor((deadlineDate.getTime() - today.getTime()) / (1000 * 3600 * 24));
          if (daysUntilDeadline <= 3 && progress < 100) {
            isWarning = true;
          }
        }

        return {
          id: p.id,
          title: p.name,
          progress,
          dueDate: p.deadline ? p.deadline.toISOString() : null,
          status: p.status === ProjectStatus.ACTIVE ? 'active' : p.status === ProjectStatus.COMPLETED ? 'completed' : 'on-hold',
          isWarning,
          tasksPending: pPending,
          tasksCompleted: pCompleted,
          totalTasks: pTotal,
        };
      })
    );

    return {
      totalProjects,
      totalTasks,
      completedTasks,
      pendingTasks,
      overdueTasks,
      tasksByStatus,
      tasksByPriority,
      highPriorityTasks,
      upcomingDeadlines,
      recentActivities,
      memberWorkload,
      projectSummaries,
    };
  }
}

export const dashboardService = new DashboardService();
