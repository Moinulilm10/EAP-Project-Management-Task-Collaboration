import { AppDataSource } from '../utils/data-source';
import { Project, ProjectStatus } from '../entities/Project.entity';
import { Task, TaskStatus } from '../entities/Task.entity';
import { LessThan, Not } from 'typeorm';

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

  async getInsights() {
    const [totalProjects, totalTasks, completedTasks] = await Promise.all([
      this.projectRepo.count(),
      this.taskRepo.count(),
      this.taskRepo.count({ where: { status: TaskStatus.DONE } }),
    ]);

    const pendingTasks = totalTasks - completedTasks;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const overdueTasks = await this.taskRepo.count({
      where: {
        dueDate: LessThan(today),
        status: Not(TaskStatus.DONE),
      },
    });

    // Get top 5 active projects to show in summary
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
      projectSummaries,
    };
  }
}

export const dashboardService = new DashboardService();
