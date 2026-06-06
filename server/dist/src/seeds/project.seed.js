"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const faker_1 = require("@faker-js/faker");
const Project_entity_1 = require("../entities/Project.entity");
const ProjectMember_entity_1 = require("../entities/ProjectMember.entity");
const User_entity_1 = require("../entities/User.entity");
const Role_entity_1 = require("../entities/Role.entity");
const data_source_1 = require("../utils/data-source");
const STATUSES = [
    Project_entity_1.ProjectStatus.ACTIVE,
    Project_entity_1.ProjectStatus.COMPLETED,
    Project_entity_1.ProjectStatus.ON_HOLD,
];
const createUserPayload = (index) => ({
    name: faker_1.faker.person.fullName(),
    email: `seed.user.${index}@example.com`,
    passwordHash: null,
    provider: User_entity_1.AuthProvider.CREDENTIALS,
    googleId: null,
    isActive: true,
});
const randomProjectStatus = () => faker_1.faker.helpers.arrayElement(STATUSES);
const randomDeadline = (status) => {
    if (status === Project_entity_1.ProjectStatus.COMPLETED) {
        return faker_1.faker.date.past({ years: 1 });
    }
    return faker_1.faker.date.soon({ days: faker_1.faker.number.int({ min: 7, max: 90 }) });
};
const makeProjectSeed = (ownerId) => {
    const status = randomProjectStatus();
    const deadline = randomDeadline(status);
    const progress = status === Project_entity_1.ProjectStatus.COMPLETED
        ? 100
        : faker_1.faker.number.int({ min: 10, max: 95 });
    return {
        name: faker_1.faker.hacker.phrase(),
        description: faker_1.faker.lorem.paragraphs(2),
        status,
        progress,
        deadline,
        ownerId,
    };
};
async function seedUsers() {
    const userRepo = data_source_1.AppDataSource.getRepository(User_entity_1.User);
    const existingUsers = await userRepo.find();
    if (existingUsers.length > 0) {
        console.log(`Found ${existingUsers.length} existing users. Using those for project owner assignment.`);
        return existingUsers;
    }
    const seedUsers = Array.from({ length: 8 }, (_, index) => userRepo.create(createUserPayload(index)));
    const saved = await userRepo.save(seedUsers);
    console.log(`Seeded ${saved.length} users.`);
    return saved;
}
async function ensureRoles(manager) {
    const roleRepo = manager.getRepository(Role_entity_1.Role);
    const rolesMap = {};
    for (const roleName of Object.values(ProjectMember_entity_1.ProjectRoleName)) {
        let role = await roleRepo.findOne({ where: { name: roleName } });
        if (!role) {
            role = roleRepo.create({ name: roleName });
            role = await roleRepo.save(role);
        }
        rolesMap[roleName] = role;
    }
    return rolesMap;
}
async function seedProjects(users) {
    const projects = Array.from({ length: 16 }, () => {
        const owner = faker_1.faker.helpers.arrayElement(users);
        return { owner };
    });
    for (const entry of projects) {
        await data_source_1.AppDataSource.manager.transaction(async (manager) => {
            const seed = makeProjectSeed(entry.owner.id);
            const project = manager.create(Project_entity_1.Project, seed);
            const savedProject = await manager.save(project);
            const rolesMap = await ensureRoles(manager);
            const members = [
                entry.owner,
                ...faker_1.faker.helpers.arrayElements(users.filter((u) => u.id !== entry.owner.id), faker_1.faker.number.int({ min: 2, max: 4 })),
            ];
            const uniqueMembers = Array.from(new Map(members.map((user) => [user.id, user])).values());
            const projectMembers = uniqueMembers.map((member) => {
                const assignedRoleName = member.id === entry.owner.id
                    ? ProjectMember_entity_1.ProjectRoleName.ADMIN
                    : faker_1.faker.helpers.arrayElement([ProjectMember_entity_1.ProjectRoleName.PROJECT_MANAGER, ProjectMember_entity_1.ProjectRoleName.TEAM_MEMBER]);
                return manager.create(ProjectMember_entity_1.ProjectMember, {
                    project: savedProject,
                    userId: member.id,
                    roleId: rolesMap[assignedRoleName].id,
                });
            });
            await manager.save(projectMembers);
            console.log(`Created project ${savedProject.id} owned by ${entry.owner.email}`);
        });
    }
}
async function main() {
    try {
        await data_source_1.AppDataSource.initialize();
        console.log("Database connection established.");
        const users = await seedUsers();
        await seedProjects(users);
        console.log("Project seeding complete.");
    }
    catch (error) {
        console.error("Failed to seed project data:", error);
        process.exit(1);
    }
    finally {
        await data_source_1.AppDataSource.destroy();
    }
}
main();
