import { faker } from "@faker-js/faker";
import { AppDataSource } from "../utils/data-source";
import { User } from "../entities/User.entity";
import { Project, ProjectStatus } from "../entities/Project.entity";
import { ProjectMember, ProjectRoleName } from "../entities/ProjectMember.entity";
import { Role } from "../entities/Role.entity";

async function main() {
  try {
    await AppDataSource.initialize();
    console.log("Database connection established.");

    const userRepo = AppDataSource.getRepository(User);
    const allUsers = await userRepo.find();

    if (allUsers.length === 0) {
      console.log("No users found. Please run users seed first.");
      return;
    }

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

    console.log("Creating 100 projects...");
    const projectRepo = AppDataSource.getRepository(Project);
    const projectMemberRepo = AppDataSource.getRepository(ProjectMember);

    const isRefresh = process.argv.includes("--refresh");
    const isClear = process.argv.includes("--clear");
    if (isRefresh || isClear) {
      console.log("Deleting existing projects...");
      await projectRepo.createQueryBuilder().delete().execute();
      if (isClear) {
        console.log("Projects cleared successfully.");
        return;
      }
    }
    
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
      
      await projectMemberRepo.save(projectMemberRepo.create({
        projectId: savedProject.id,
        userId: owner.id,
        roleId: rolesMap[ProjectRoleName.ADMIN].id,
      }));
    }

    console.log("Projects seeding complete.");
  } catch (err) {
    console.error("Error during projects seeding:", err);
  } finally {
    await AppDataSource.destroy();
  }
}

main();
