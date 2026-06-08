import { AppDataSource } from "../utils/data-source";
import { User } from "../entities/User.entity";
import { Project } from "../entities/Project.entity";
import { Team } from "../entities/Team.entity";
import { Task } from "../entities/Task.entity";

async function main() {
  await AppDataSource.initialize();
  const userCount = await AppDataSource.getRepository(User).count();
  const projectCount = await AppDataSource.getRepository(Project).count();
  const teamCount = await AppDataSource.getRepository(Team).count();
  const taskCount = await AppDataSource.getRepository(Task).count();
  
  console.log(`CURRENT COUNTS:`);
  console.log(`Users: ${userCount}`);
  console.log(`Projects: ${projectCount}`);
  console.log(`Teams: ${teamCount}`);
  console.log(`Tasks: ${taskCount}`);
  await AppDataSource.destroy();
}

main();
