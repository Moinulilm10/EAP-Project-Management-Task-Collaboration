import { faker } from "@faker-js/faker";
import * as bcrypt from "bcryptjs";
import { AppDataSource } from "../utils/data-source";
import { User, AuthProvider } from "../entities/User.entity";
import { Project, ProjectStatus } from "../entities/Project.entity";
import { ProjectMember, ProjectRoleName } from "../entities/ProjectMember.entity";
import { Team } from "../entities/Team.entity";
import { TeamMember, TeamRoleName } from "../entities/TeamMember.entity";
import { Task, TaskStatus, TaskPriority } from "../entities/Task.entity";
import { Role } from "../entities/Role.entity";

async function main() {
  try {
    await AppDataSource.initialize();
    console.log("Database connection established.");
    
    // Create Users
    const userRepo = AppDataSource.getRepository(User);
    const passwordHash = await bcrypt.hash("Password123!", 10);
    
    console.log("Creating 5 users with password 'Password123!'...");
    const newUsers: User[] = [];
    for (let i = 0; i < 5; i++) {
      const email = `seeduser${Date.now()}_${i}@example.com`;
      const user = userRepo.create({
        name: faker.person.fullName(),
        email: email,
        passwordHash,
        provider: AuthProvider.CREDENTIALS,
        isActive: true,
      });
      newUsers.push(user);
    }
    const savedUsers = await userRepo.save(newUsers);
    
    console.log(`Created 5 users. Passwords are 'Password123!'.`);
    savedUsers.forEach((u, i) => console.log(`User ${i + 1}: ${u.email}`));

    // Fetch all existing users to ensure we have a good pool for random selection
    const allUsers = await userRepo.find();

    // Ensure roles
    const roleRepo = AppDataSource.getRepository(Role);
    const rolesMap = {} as Record<ProjectRoleName, Role>;
    for (const roleName of Object.values(ProjectRoleName)) {
      let role = await roleRepo.findOne({ where: { name: roleName } });
      if (!role) {
        role = roleRepo.create({ name: roleName });
        role = await roleRepo.save(role);
      }
      rolesMap[roleName] = role;
    }

    // Create 100 Projects
    console.log("Creating 100 projects...");
    const projectRepo = AppDataSource.getRepository(Project);
    const projectMemberRepo = AppDataSource.getRepository(ProjectMember);
    const savedProjects: Project[] = [];
    
    for (let i = 0; i < 100; i++) {
      const owner = faker.helpers.arrayElement(allUsers);
      const status = faker.helpers.arrayElement(Object.values(ProjectStatus));
      let deadline: Date | null = null;
      if (status === ProjectStatus.COMPLETED) {
        deadline = faker.date.past({ years: 1 });
      } else {
        deadline = faker.date.soon({ days: faker.number.int({ min: 7, max: 90 }) });
      }

      const project = projectRepo.create({
        name: faker.hacker.phrase().substring(0, 50),
        description: faker.lorem.paragraphs(1),
        status,
        progress: status === ProjectStatus.COMPLETED ? 100 : faker.number.int({ min: 0, max: 90 }),
        deadline,
        ownerId: owner.id,
      });
      
      const savedProject = await projectRepo.save(project);
      savedProjects.push(savedProject);
      
      // Assign owner as admin
      await projectMemberRepo.save(projectMemberRepo.create({
        projectId: savedProject.id,
        userId: owner.id,
        roleId: rolesMap[ProjectRoleName.ADMIN].id,
      }));
    }
    
    // Create 100 Teams
    console.log("Creating 100 teams...");
    const teamRepo = AppDataSource.getRepository(Team);
    const teamMemberRepo = AppDataSource.getRepository(TeamMember);
    const savedTeams: Team[] = [];
    
    for (let i = 0; i < 100; i++) {
      const team = teamRepo.create({
        name: faker.company.name() + " Team",
        description: faker.lorem.sentence(),
        maxMembers: faker.number.int({ min: 5, max: 20 }),
      });
      const savedTeam = await teamRepo.save(team);
      savedTeams.push(savedTeam);
      
      // Assign random members
      const numMembers = faker.number.int({ min: 1, max: 5 });
      const members = faker.helpers.arrayElements(allUsers, Math.min(numMembers, allUsers.length));
      
      for (const member of members) {
        // avoid duplicate constraints
        try {
          await teamMemberRepo.save(teamMemberRepo.create({
            teamId: savedTeam.id,
            userId: member.id,
            role: faker.helpers.arrayElement(Object.values(TeamRoleName)),
          }));
        } catch (err) {} // ignore duplicates
      }
    }
    
    // Create 100 Tasks
    console.log("Creating 100 tasks...");
    const taskRepo = AppDataSource.getRepository(Task);
    
    for (let i = 0; i < 100; i++) {
      const project = faker.helpers.arrayElement(savedProjects);
      const creator = faker.helpers.arrayElement(allUsers);
      const assignee = faker.datatype.boolean() ? faker.helpers.arrayElement(allUsers) : null;
      
      const task = taskRepo.create({
        title: faker.hacker.phrase().substring(0, 100),
        description: faker.lorem.paragraph(),
        status: faker.helpers.arrayElement(Object.values(TaskStatus)),
        priority: faker.helpers.arrayElement(Object.values(TaskPriority)),
        projectId: project.id,
        createdById: creator.id,
        assigneeId: assignee?.id || null,
        dueDate: faker.date.soon({ days: faker.number.int({ min: 1, max: 30 }) }),
      });
      
      await taskRepo.save(task);
    }

    console.log("Seeding complete.");
  } catch (err) {
    console.error("Error during seeding:", err);
  } finally {
    await AppDataSource.destroy();
  }
}

main();
