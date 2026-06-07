import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../../app';
import { AppDataSource } from '../../utils/data-source';
import { User } from '../../entities/User.entity';
import { Project, ProjectStatus } from '../../entities/Project.entity';
import { Task, TaskPriority, TaskStatus } from '../../entities/Task.entity';
import { ensureTestSchema } from '../../utils/test-setup';
import { projectService } from '../../services/project.service';
import { taskService } from '../../services/task.service';

import { Role } from '../../entities/Role.entity';
import { ProjectRoleName } from '../../entities/ProjectMember.entity';

describe('Dashboard Insights API Integration Tests', () => {
  let token: string;
  let userId: string;

  beforeAll(async () => {
    await ensureTestSchema();
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }
    await AppDataSource.synchronize(true);

    // Seed roles
    const roleRepo = AppDataSource.getRepository(Role);
    for (const name of Object.values(ProjectRoleName)) {
      await roleRepo.save(roleRepo.create({ name }));
    }

    const resUser = await request(app).post('/api/v1/auth/register').send({
      email: 'dashboard@test.com',
      password: 'Password123!',
      name: 'Dashboard Tester',
    });
    token = resUser.body.accessToken;
    userId = resUser.body.user.id;
  }, 30000);

  afterAll(async () => {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
  });

  beforeEach(async () => {
    await AppDataSource.query('DELETE FROM tasks');
    await AppDataSource.query('DELETE FROM projects');
    await AppDataSource.query('DELETE FROM activities');
  });

  it('should return correct counts and summaries for an empty database', async () => {
    const res = await request(app)
      .get('/api/v1/dashboard/insights')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.totalProjects).toBe(0);
    expect(res.body.totalTasks).toBe(0);
    expect(res.body.completedTasks).toBe(0);
    expect(res.body.pendingTasks).toBe(0);
    expect(res.body.overdueTasks).toBe(0);
    expect(res.body.projectSummaries).toEqual([]);
  });

  it('should calculate accurate metrics for tasks and projects', async () => {
    const projectRepo = AppDataSource.getRepository(Project);
    const taskRepo = AppDataSource.getRepository(Task);

    const p1 = await projectRepo.save(
      projectRepo.create({
        name: 'Website Redesign',
        description: 'New website',
        ownerId: userId,
        status: ProjectStatus.ACTIVE,
      })
    );

    const p2 = await projectRepo.save(
      projectRepo.create({
        name: 'Mobile App',
        description: 'New app',
        ownerId: userId,
        status: ProjectStatus.ACTIVE,
        deadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // Deadline in 2 days
      })
    );

    // Create tasks for p1 (5 pending)
    for (let i = 0; i < 5; i++) {
      await taskRepo.save(
        taskRepo.create({
          title: `Task ${i}`,
          projectId: p1.id,
          createdById: userId,
          status: TaskStatus.TODO,
        })
      );
    }

    // Create tasks for p2 (4 completed, 1 pending => 80% completed)
    for (let i = 0; i < 4; i++) {
      await taskRepo.save(
        taskRepo.create({
          title: `Done ${i}`,
          projectId: p2.id,
          createdById: userId,
          status: TaskStatus.DONE,
        })
      );
    }
    await taskRepo.save(
      taskRepo.create({
        title: `Pending task`,
        projectId: p2.id,
        createdById: userId,
        status: TaskStatus.IN_PROGRESS,
      })
    );

    // Create 1 overdue task in p1
    await taskRepo.save(
      taskRepo.create({
        title: `Overdue task`,
        projectId: p1.id,
        createdById: userId,
        status: TaskStatus.TODO,
        dueDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
      })
    );

    const res = await request(app)
      .get('/api/v1/dashboard/insights')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.totalProjects).toBe(2);
    expect(res.body.totalTasks).toBe(11); // 5 + 4 + 1 + 1
    expect(res.body.completedTasks).toBe(4);
    expect(res.body.pendingTasks).toBe(7);
    expect(res.body.overdueTasks).toBe(1);

    const summaries = res.body.projectSummaries;
    expect(summaries.length).toBe(2);

    const mobileApp = summaries.find((s: any) => s.id === p2.id);
    expect(mobileApp).toBeDefined();
    expect(mobileApp.progress).toBe(80); // 4 out of 5
    expect(mobileApp.isWarning).toBe(true); // Deadline in 2 days

    const website = summaries.find((s: any) => s.id === p1.id);
    expect(website).toBeDefined();
    expect(website.tasksPending).toBe(6); // 5 pending + 1 overdue
  });

  it('should track recent system activities in Activity Log', async () => {
    // 1. Create a project
    const project = await projectService.create({
      name: 'E-Commerce App',
      description: 'E-Commerce Description',
      ownerId: userId,
    });

    // 2. Create a task and assign it
    const task = await taskService.create({
      title: 'Setup API',
      projectId: project.id,
      createdById: userId,
      assigneeId: userId, // assigning to dashboard tester
    });

    // 3. Mark the task as completed
    await taskService.update(task.id, {
      status: TaskStatus.DONE,
    });

    // 4. Hit insights endpoint
    const res = await request(app)
      .get('/api/v1/dashboard/insights')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.recentActivities.length).toBeGreaterThanOrEqual(3);

    // Verify activities are in reverse chronological order
    const activities = res.body.recentActivities;
    
    // Most recent first: Task Setup API marked as Completed
    expect(activities[0].user).toBe('Task “Setup API”');
    expect(activities[0].action).toBe('marked as');
    expect(activities[0].target).toBe('Completed');

    // Next: Task assigned to assignee
    const dashboardTesterActivity = activities.find((a: any) => a.action === 'assigned to');
    expect(dashboardTesterActivity).toBeDefined();
    expect(dashboardTesterActivity.user).toBe('Task “Setup API”');
    expect(dashboardTesterActivity.target).toBe('Dashboard Tester');

    // Next: Project created
    const projectCreatedActivity = activities.find((a: any) => a.action === 'created' && a.user.includes('Project'));
    expect(projectCreatedActivity).toBeDefined();
    expect(projectCreatedActivity.user).toBe('Project “E-Commerce App”');
  });
});
