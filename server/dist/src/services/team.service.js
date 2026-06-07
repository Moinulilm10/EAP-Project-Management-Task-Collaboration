"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.teamService = exports.TeamService = void 0;
const data_source_1 = require("../utils/data-source");
const Team_entity_1 = require("../entities/Team.entity");
const TeamMember_entity_1 = require("../entities/TeamMember.entity");
const ProjectTeam_entity_1 = require("../entities/ProjectTeam.entity");
const TaskTeam_entity_1 = require("../entities/TaskTeam.entity");
class TeamService {
    teamRepository = data_source_1.AppDataSource.getRepository(Team_entity_1.Team);
    teamMemberRepository = data_source_1.AppDataSource.getRepository(TeamMember_entity_1.TeamMember);
    projectTeamRepository = data_source_1.AppDataSource.getRepository(ProjectTeam_entity_1.ProjectTeam);
    taskTeamRepository = data_source_1.AppDataSource.getRepository(TaskTeam_entity_1.TaskTeam);
    async createTeam(userId, name, description, maxMembers = 10) {
        const queryRunner = data_source_1.AppDataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const team = this.teamRepository.create({
                name,
                description,
                maxMembers,
            });
            await queryRunner.manager.save(team);
            const member = this.teamMemberRepository.create({
                teamId: team.id,
                userId,
                role: TeamMember_entity_1.TeamRoleName.ADMIN,
            });
            await queryRunner.manager.save(member);
            await queryRunner.commitTransaction();
            return team;
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        }
        finally {
            await queryRunner.release();
        }
    }
    async getTeams(userId, page = 1, limit = 10) {
        const skip = (page - 1) * limit;
        const [teams, total] = await this.teamRepository
            .createQueryBuilder("team")
            .innerJoin("team.members", "member", "member.userId = :userId", { userId })
            .leftJoinAndSelect("team.members", "allMembers")
            .leftJoinAndSelect("allMembers.user", "user")
            .leftJoinAndSelect("team.projectTeams", "projectTeams")
            .leftJoinAndSelect("projectTeams.project", "project")
            .leftJoinAndSelect("team.taskTeams", "taskTeams")
            .leftJoinAndSelect("taskTeams.task", "task")
            .skip(skip)
            .take(limit)
            .getManyAndCount();
        return {
            data: teams,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async getTeamById(teamId, userId) {
        const team = await this.teamRepository
            .createQueryBuilder("team")
            .leftJoinAndSelect("team.members", "members")
            .leftJoinAndSelect("members.user", "user")
            .leftJoinAndSelect("team.projectTeams", "projectTeams")
            .leftJoinAndSelect("projectTeams.project", "project")
            .leftJoinAndSelect("team.taskTeams", "taskTeams")
            .leftJoinAndSelect("taskTeams.task", "task")
            .where("team.id = :teamId", { teamId })
            .getOne();
        if (!team) {
            throw { status: 404, message: "Team not found" };
        }
        const isMember = team.members.some((m) => m.userId === userId);
        if (!isMember) {
            throw { status: 403, message: "Access denied" };
        }
        return team;
    }
    async addMember(teamId, adminId, userIdToAdd, role = TeamMember_entity_1.TeamRoleName.MEMBER) {
        const adminMember = await this.teamMemberRepository.findOne({
            where: { teamId, userId: adminId },
        });
        if (!adminMember || adminMember.role !== TeamMember_entity_1.TeamRoleName.ADMIN) {
            throw { status: 403, message: "Only team admins can add members" };
        }
        const team = await this.teamRepository.findOne({
            where: { id: teamId },
            relations: { members: true },
        });
        if (!team) {
            throw { status: 404, message: "Team not found" };
        }
        if (team.members.length >= team.maxMembers) {
            throw { status: 400, message: "Team capacity reached. Increase capacity to add more members." };
        }
        const existingMember = await this.teamMemberRepository.findOne({
            where: { teamId, userId: userIdToAdd },
        });
        if (existingMember) {
            throw { status: 400, message: "User is already a member of this team" };
        }
        const newMember = this.teamMemberRepository.create({
            teamId,
            userId: userIdToAdd,
            role,
        });
        return this.teamMemberRepository.save(newMember);
    }
    async assignProject(teamId, adminId, projectId) {
        const adminMember = await this.teamMemberRepository.findOne({
            where: { teamId, userId: adminId },
        });
        if (!adminMember || adminMember.role !== TeamMember_entity_1.TeamRoleName.ADMIN) {
            throw { status: 403, message: "Only team admins can assign projects" };
        }
        const existingAssign = await this.projectTeamRepository.findOne({
            where: { teamId, projectId },
        });
        if (existingAssign) {
            throw { status: 400, message: "Project already assigned to team" };
        }
        const projectTeam = this.projectTeamRepository.create({ teamId, projectId });
        return this.projectTeamRepository.save(projectTeam);
    }
    async assignTask(teamId, adminId, taskId) {
        const adminMember = await this.teamMemberRepository.findOne({
            where: { teamId, userId: adminId },
        });
        if (!adminMember || adminMember.role !== TeamMember_entity_1.TeamRoleName.ADMIN) {
            throw { status: 403, message: "Only team admins can assign tasks" };
        }
        const existingAssign = await this.taskTeamRepository.findOne({
            where: { teamId, taskId },
        });
        if (existingAssign) {
            throw { status: 400, message: "Task already assigned to team" };
        }
        const taskTeam = this.taskTeamRepository.create({ teamId, taskId });
        return this.taskTeamRepository.save(taskTeam);
    }
    async updateCapacity(teamId, adminId, maxMembers) {
        const adminMember = await this.teamMemberRepository.findOne({
            where: { teamId, userId: adminId },
        });
        if (!adminMember || adminMember.role !== TeamMember_entity_1.TeamRoleName.ADMIN) {
            throw { status: 403, message: "Only team admins can update capacity" };
        }
        const team = await this.teamRepository.findOne({
            where: { id: teamId },
            relations: { members: true },
        });
        if (!team) {
            throw { status: 404, message: "Team not found" };
        }
        if (maxMembers < team.members.length) {
            throw { status: 400, message: "Cannot reduce capacity below current member count" };
        }
        team.maxMembers = maxMembers;
        return this.teamRepository.save(team);
    }
    async updateTeam(teamId, adminId, payload) {
        const adminMember = await this.teamMemberRepository.findOne({
            where: { teamId, userId: adminId },
        });
        if (!adminMember || adminMember.role !== TeamMember_entity_1.TeamRoleName.ADMIN) {
            throw { status: 403, message: "Only team admins can update team details" };
        }
        const team = await this.teamRepository.findOne({ where: { id: teamId } });
        if (!team) {
            throw { status: 404, message: "Team not found" };
        }
        if (payload.name)
            team.name = payload.name;
        if (payload.description !== undefined)
            team.description = payload.description;
        return this.teamRepository.save(team);
    }
    async deleteTeam(teamId, adminId) {
        const adminMember = await this.teamMemberRepository.findOne({
            where: { teamId, userId: adminId },
        });
        if (!adminMember || adminMember.role !== TeamMember_entity_1.TeamRoleName.ADMIN) {
            throw { status: 403, message: "Only team admins can delete teams" };
        }
        const team = await this.teamRepository.findOne({ where: { id: teamId } });
        if (!team) {
            throw { status: 404, message: "Team not found" };
        }
        await this.teamRepository.softDelete(teamId);
        return { success: true, message: "Team deleted successfully" };
    }
    async removeMember(teamId, adminId, userIdToRemove) {
        const adminMember = await this.teamMemberRepository.findOne({
            where: { teamId, userId: adminId },
        });
        if (!adminMember || adminMember.role !== TeamMember_entity_1.TeamRoleName.ADMIN) {
            throw { status: 403, message: "Only team admins can remove members" };
        }
        if (adminId === userIdToRemove) {
            throw { status: 400, message: "Admins cannot remove themselves. Assign another admin first or delete the team." };
        }
        const memberToRemove = await this.teamMemberRepository.findOne({
            where: { teamId, userId: userIdToRemove },
        });
        if (!memberToRemove) {
            throw { status: 404, message: "Member not found in this team" };
        }
        await this.teamMemberRepository.remove(memberToRemove);
        return { success: true, message: "Member removed successfully" };
    }
}
exports.TeamService = TeamService;
exports.teamService = new TeamService();
