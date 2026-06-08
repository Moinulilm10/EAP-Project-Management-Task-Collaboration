import { AppDataSource } from "../utils/data-source";
import { Task } from "../entities/Task.entity";

async function main() {
  await AppDataSource.initialize();
  const taskRepo = AppDataSource.getRepository(Task);
  
  const beforeTasks = await taskRepo.find({ take: 5 });
  console.log("Before refresh, first 5 task IDs:", beforeTasks.map(t => t.id));
  
  console.log("Executing delete...");
  const deleteResult = await taskRepo.createQueryBuilder().delete().execute();
  console.log("Delete result:", deleteResult);
  
  const afterTasks = await taskRepo.find({ take: 5 });
  console.log("After refresh, first 5 task IDs:", afterTasks.map(t => t.id));
  
  await AppDataSource.destroy();
}

main();
