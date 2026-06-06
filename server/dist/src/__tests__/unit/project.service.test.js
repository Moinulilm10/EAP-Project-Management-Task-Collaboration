"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const project_service_1 = require("../../services/project.service");
const data_source_1 = require("../../utils/data-source");
const Project_entity_1 = require("../../entities/Project.entity");
const ProjectMember_entity_1 = require("../../entities/ProjectMember.entity");
// Mock dependencies
vitest_1.vi.mock('../../utils/data-source', () => ({
    AppDataSource: {
        getRepository: vitest_1.vi.fn(),
        manager: {
            transaction: vitest_1.vi.fn(),
        },
    },
}));
(0, vitest_1.describe)('projectService', () => {
    const mockProjectRepo = {
        findOne: vitest_1.vi.fn(),
        createQueryBuilder: vitest_1.vi.fn(),
        save: vitest_1.vi.fn(),
    };
    const mockMemberRepo = {
        findOne: vitest_1.vi.fn(),
        count: vitest_1.vi.fn(),
        save: vitest_1.vi.fn(),
    };
    const mockManager = {
        create: vitest_1.vi.fn(),
        save: vitest_1.vi.fn(),
        findOneBy: vitest_1.vi.fn(),
    };
    (0, vitest_1.beforeEach)(() => {
        vitest_1.vi.clearAllMocks();
        data_source_1.AppDataSource.getRepository.mockImplementation((entity) => {
            if (entity.name === 'Project')
                return mockProjectRepo;
            if (entity.name === 'ProjectMember')
                return mockMemberRepo;
        });
        // Mock transaction to immediately execute the callback with mockManager
        data_source_1.AppDataSource.manager.transaction.mockImplementation((cb) => cb(mockManager));
    });
    (0, vitest_1.describe)('create', () => {
        (0, vitest_1.it)('should create a project and set the creator as Admin', async () => {
            const savedProj = { id: 'proj-1', name: 'Test Proj', ownerId: 'user-1' };
            const adminRole = { id: 'role-admin-uuid', name: ProjectMember_entity_1.ProjectRoleName.ADMIN };
            mockManager.create.mockImplementation((entity, data) => data);
            mockManager.save.mockImplementation(async (data) => {
                if (data.name === 'Test Proj')
                    return savedProj;
                return data;
            });
            mockManager.findOneBy.mockResolvedValue(adminRole);
            const data = {
                name: 'Test Proj',
                description: 'Test Desc',
                deadline: '2026-12-31',
                status: Project_entity_1.ProjectStatus.ACTIVE,
                ownerId: 'user-1',
            };
            const result = await project_service_1.projectService.create(data);
            (0, vitest_1.expect)(mockManager.create).toHaveBeenCalledWith(vitest_1.expect.any(Function), vitest_1.expect.objectContaining({
                name: data.name,
                description: data.description,
                ownerId: data.ownerId,
            }));
            (0, vitest_1.expect)(mockManager.findOneBy).toHaveBeenCalledWith(vitest_1.expect.any(Function), { name: ProjectMember_entity_1.ProjectRoleName.ADMIN });
            (0, vitest_1.expect)(result).toEqual(savedProj);
        });
    });
    (0, vitest_1.describe)('findById', () => {
        (0, vitest_1.it)('should return project if found', async () => {
            const project = { id: 'proj-1', name: 'Test Proj' };
            mockProjectRepo.findOne.mockResolvedValue(project);
            const result = await project_service_1.projectService.findById('proj-1');
            (0, vitest_1.expect)(result).toEqual(project);
        });
        (0, vitest_1.it)('should throw 404 if not found', async () => {
            mockProjectRepo.findOne.mockResolvedValue(null);
            await (0, vitest_1.expect)(project_service_1.projectService.findById('proj-1')).rejects.toEqual({
                status: 404,
                message: 'Project not found.',
            });
        });
    });
    (0, vitest_1.describe)('update', () => {
        (0, vitest_1.it)('should update project if updated by project admin', async () => {
            const project = { id: 'proj-1', name: 'Test Proj' };
            const membership = { role: { name: ProjectMember_entity_1.ProjectRoleName.ADMIN } };
            mockProjectRepo.findOne.mockResolvedValue(project);
            mockMemberRepo.findOne.mockResolvedValue(membership);
            mockProjectRepo.save.mockImplementation(async (p) => p);
            const result = await project_service_1.projectService.update('proj-1', { name: 'New Name' }, 'user-admin-1');
            (0, vitest_1.expect)(result.name).toBe('New Name');
        });
        (0, vitest_1.it)('should throw 403 if user is not project admin', async () => {
            const project = { id: 'proj-1', name: 'Test Proj' };
            const membership = { role: { name: ProjectMember_entity_1.ProjectRoleName.TEAM_MEMBER } };
            mockProjectRepo.findOne.mockResolvedValue(project);
            mockMemberRepo.findOne.mockResolvedValue(membership);
            await (0, vitest_1.expect)(project_service_1.projectService.update('proj-1', { name: 'New Name' }, 'user-member-1')).rejects.toEqual({
                status: 403,
                message: 'Project update requires project admin membership.',
            });
        });
    });
    (0, vitest_1.describe)('delete', () => {
        (0, vitest_1.it)('should delete project if deleted by project admin', async () => {
            const project = { id: 'proj-1', name: 'Test Proj', deletedAt: null };
            const membership = { role: { name: ProjectMember_entity_1.ProjectRoleName.ADMIN } };
            mockProjectRepo.findOne.mockResolvedValue(project);
            mockMemberRepo.findOne.mockResolvedValue(membership);
            mockProjectRepo.save.mockImplementation(async (p) => p);
            await (0, vitest_1.expect)(project_service_1.projectService.delete('proj-1', 'user-admin-1')).resolves.not.toThrow();
        });
        (0, vitest_1.it)('should throw 403 if user is not project admin', async () => {
            const project = { id: 'proj-1', name: 'Test Proj', deletedAt: null };
            const membership = { role: { name: ProjectMember_entity_1.ProjectRoleName.TEAM_MEMBER } };
            mockProjectRepo.findOne.mockResolvedValue(project);
            mockMemberRepo.findOne.mockResolvedValue(membership);
            await (0, vitest_1.expect)(project_service_1.projectService.delete('proj-1', 'user-member-1')).rejects.toEqual({
                status: 403,
                message: 'Project deletion requires project admin membership.',
            });
        });
    });
});
