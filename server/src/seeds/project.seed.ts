import { faker } from "@faker-js/faker";
import { Project, ProjectStatus } from "../entities/Project.entity";
import {
  ProjectMember,
  ProjectMemberRole,
} from "../entities/ProjectMember.entity";
import { AuthProvider, User, UserRole } from "../entities/User.entity";
import { AppDataSource } from "../utils/data-source";

const STATUSES = [
  ProjectStatus.ACTIVE,
  ProjectStatus.COMPLETED,
  ProjectStatus.ON_HOLD,
] as const;

const createUserPayload = (index: number): Partial<User> => ({
  name: faker.person.fullName(),
  email: `seed.user.${index}@example.com`,
  passwordHash: null,
  role:
    index === 0
      ? UserRole.ADMIN
      : index === 1
        ? UserRole.PROJECT_MANAGER
        : UserRole.TEAM_MEMBER,
  provider: AuthProvider.CREDENTIALS,
  googleId: null,
  isActive: true,
});

const randomProjectStatus = (): ProjectStatus =>
  faker.helpers.arrayElement(STATUSES);

const randomDeadline = (status: ProjectStatus): Date | null => {
  if (status === ProjectStatus.COMPLETED) {
    return faker.date.past({ years: 1 });
  }

  return faker.date.soon({ days: faker.number.int({ min: 7, max: 90 }) });
};

const makeProjectSeed = (ownerId: string): Partial<Project> => {
  const status = randomProjectStatus();
  const deadline = randomDeadline(status);
  const progress =
    status === ProjectStatus.COMPLETED
      ? 100
      : faker.number.int({ min: 10, max: 95 });

  return {
    name: faker.hacker.phrase(),
    description: faker.lorem.paragraphs(2),
    status,
    progress,
    deadline,
    ownerId,
  };
};

async function seedUsers(): Promise<User[]> {
  const userRepo = AppDataSource.getRepository(User);
  const existingUsers = await userRepo.find();

  if (existingUsers.length > 0) {
    console.log(
      `Found ${existingUsers.length} existing users. Using those for project owner assignment.`,
    );
    return existingUsers;
  }

  const seedUsers = Array.from({ length: 8 }, (_, index) =>
    userRepo.create(createUserPayload(index)),
  );
  const saved = await userRepo.save(seedUsers);
  console.log(`Seeded ${saved.length} users.`);
  return saved;
}

async function seedProjects(users: User[]): Promise<void> {
  const projectRepo = AppDataSource.getRepository(Project);
  const membershipRepo = AppDataSource.getRepository(ProjectMember);

  const projects = Array.from({ length: 16 }, () => {
    const owner = faker.helpers.arrayElement(users);
    return { owner };
  });

  for (const entry of projects) {
    await AppDataSource.manager.transaction(async (manager) => {
      const seed = makeProjectSeed(entry.owner.id);
      const project = manager.create(Project, seed);
      const savedProject = await manager.save(project);

      const members = [
        entry.owner,
        ...faker.helpers.arrayElements(
          users.filter((u) => u.id !== entry.owner.id),
          faker.number.int({ min: 2, max: 4 }),
        ),
      ];
      const uniqueMembers = Array.from(
        new Map(members.map((user) => [user.id, user])).values(),
      );

      const projectMembers = uniqueMembers.map((member) =>
        manager.create(ProjectMember, {
          project: savedProject,
          userId: member.id,
          role:
            member.id === entry.owner.id
              ? ProjectMemberRole.ADMIN
              : ProjectMemberRole.MEMBER,
        }),
      );

      await manager.save(projectMembers);
      console.log(
        `Created project ${savedProject.id} owned by ${entry.owner.email}`,
      );
    });
  }
}

async function main(): Promise<void> {
  try {
    await AppDataSource.initialize();
    console.log("Database connection established.");

    const users = await seedUsers();
    await seedProjects(users);

    console.log("Project seeding complete.");
  } catch (error) {
    console.error("Failed to seed project data:", error);
    process.exit(1);
  } finally {
    await AppDataSource.destroy();
  }
}

main();
