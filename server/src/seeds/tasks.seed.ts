import { faker } from "@faker-js/faker";
import { AppDataSource } from "../utils/data-source";
import { User } from "../entities/User.entity";
import { Project } from "../entities/Project.entity";
import { Task, TaskStatus, TaskPriority } from "../entities/Task.entity";

async function main() {
  try {
    await AppDataSource.initialize();
    console.log("Database connection established.");

    const userRepo = AppDataSource.getRepository(User);
    const projectRepo = AppDataSource.getRepository(Project);
    
    const allUsers = await userRepo.find();
    const savedProjects = await projectRepo.find();

    if (allUsers.length === 0 || savedProjects.length === 0) {
      console.log("Ensure users and projects exist before seeding tasks.");
      return;
    }

    console.log("Creating 100 tasks...");
    const taskRepo = AppDataSource.getRepository(Task);

    const isRefresh = process.argv.includes("--refresh");
    const isClear = process.argv.includes("--clear");
    if (isRefresh || isClear) {
      console.log("Deleting existing tasks...");
      await taskRepo.createQueryBuilder().delete().execute();
      if (isClear) {
        console.log("Tasks cleared successfully.");
        return;
      }
    }
    
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

    console.log("Tasks seeding complete.");
  } catch (err) {
    console.error("Error during tasks seeding:", err);
  } finally {
    await AppDataSource.destroy();
  }
}

main();
