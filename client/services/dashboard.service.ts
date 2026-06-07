import api from './api';

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

export interface DashboardInsights {
  totalProjects: number;
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  overdueTasks: number;
  projectSummaries: ProjectSummary[];
}

export const dashboardService = {
  getInsights: async (): Promise<DashboardInsights> => {
    const response = await api.get('/dashboard/insights');
    return response.data;
  },
};
