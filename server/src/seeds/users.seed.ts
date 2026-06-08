import { faker } from "@faker-js/faker";
import * as bcrypt from "bcryptjs";
import { AppDataSource } from "../utils/data-source";
import { User, AuthProvider } from "../entities/User.entity";

async function main() {
  try {
    await AppDataSource.initialize();
    console.log("Database connection established.");
    
    // Create Users
    const userRepo = AppDataSource.getRepository(User);

    const isRefresh = process.argv.includes("--refresh");
    const isClear = process.argv.includes("--clear");
    if (isRefresh || isClear) {
      console.log("Deleting existing users...");
      await userRepo.createQueryBuilder().delete().execute();
      if (isClear) {
        console.log("Users cleared successfully.");
        return;
      }
    }

    // Ensure demo user exists
    let demoUser = await userRepo.findOne({ where: { email: "admin@projectflow.com" } });
    if (!demoUser) {
      const demoHash = await bcrypt.hash("demo12345", 10);
      demoUser = userRepo.create({
        name: "Admin User",
        email: "admin@projectflow.com",
        passwordHash: demoHash,
        provider: AuthProvider.CREDENTIALS,
        isActive: true,
      });
      demoUser = await userRepo.save(demoUser);
      console.log("Seeded default demo user: admin@projectflow.com / demo12345");
    }

    const passwordHash = await bcrypt.hash("Password123!", 10);
    
    console.log("Creating 4 dynamic users with password 'Password123!'...");
    const newUsers: User[] = [];
    for (let i = 0; i < 4; i++) {
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
    
    console.log(`Created 4 dynamic users. Passwords are 'Password123!'.`);
    savedUsers.forEach((u, i) => console.log(`User ${i + 1}: ${u.email}`));

    console.log("Users seeding complete.");
  } catch (err) {
    console.error("Error during users seeding:", err);
  } finally {
    await AppDataSource.destroy();
  }
}

main();
