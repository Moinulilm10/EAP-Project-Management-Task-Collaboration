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

export interface TaskPriorityItem {
  id: string;
  title: string;
  project: string;
  dueDate: string | null;
  priority: 'low' | 'medium' | 'high' | 'critical';
  isOverdue?: boolean;
  assigneeInitials: string;
}

export interface RecentActivityItem {
  id: string;
  user: string;
  action: string;
  target: string;
  time: string;
  status: string;
}

export interface MemberWorkloadItem {
  userId: string;
  userName: string;
  userInitials: string;
  taskCount: number;
}

export interface DashboardInsights {
  totalProjects: number;
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  overdueTasks: number;
  tasksByStatus: { todo: number; inProgress: number; review: number; done: number };
  tasksByPriority: { low: number; medium: number; high: number; critical: number };
  highPriorityTasks: TaskPriorityItem[];
  upcomingDeadlines: TaskPriorityItem[];
  recentActivities: RecentActivityItem[];
  memberWorkload: MemberWorkloadItem[];
  projectSummaries: ProjectSummary[];
}

export const dashboardService = {
  getInsights: async (): Promise<DashboardInsights> => {
    const response = await api.get('/dashboard/insights');
    return response.data;
  },
};
