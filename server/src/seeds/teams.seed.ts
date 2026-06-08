import { faker } from "@faker-js/faker";
import { AppDataSource } from "../utils/data-source";
import { User } from "../entities/User.entity";
import { Team } from "../entities/Team.entity";
import { TeamMember, TeamRoleName } from "../entities/TeamMember.entity";

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

    console.log("Creating 100 teams...");
    const teamRepo = AppDataSource.getRepository(Team);
    const teamMemberRepo = AppDataSource.getRepository(TeamMember);

    const isRefresh = process.argv.includes("--refresh");
    const isClear = process.argv.includes("--clear");
    if (isRefresh || isClear) {
      console.log("Deleting existing teams...");
      await teamRepo.createQueryBuilder().delete().execute();
      if (isClear) {
        console.log("Teams cleared successfully.");
        return;
      }
    }
    
    for (let i = 0; i < 100; i++) {
      const team = teamRepo.create({
        name: faker.company.name() + " Team",
        description: faker.lorem.sentence(),
        maxMembers: faker.number.int({ min: 5, max: 20 }),
      });
      const savedTeam = await teamRepo.save(team);
      
      const numMembers = faker.number.int({ min: 1, max: 5 });
      const members = faker.helpers.arrayElements(allUsers, Math.min(numMembers, allUsers.length));
      
      for (const member of members) {
        try {
          await teamMemberRepo.save(teamMemberRepo.create({
            teamId: savedTeam.id,
            userId: member.id,
            role: faker.helpers.arrayElement(Object.values(TeamRoleName)),
          }));
        } catch (err) {}
      }
    }

    console.log("Teams seeding complete.");
  } catch (err) {
    console.error("Error during teams seeding:", err);
  } finally {
    await AppDataSource.destroy();
  }
}

main();
