import { AppDataSource } from "../utils/data-source";
import { Team } from "../entities/Team.entity";
import { TeamMember, TeamRoleName } from "../entities/TeamMember.entity";
import { ProjectTeam } from "../entities/ProjectTeam.entity";
import { TaskTeam } from "../entities/TaskTeam.entity";
import { User } from "../entities/User.entity";
import { Project } from "../entities/Project.entity";
import { Task } from "../entities/Task.entity";
import { Activity } from "../entities/Activity.entity";
import { Attachment } from "../entities/Attachment.entity";

export class TeamService {
  private teamRepository = AppDataSource.getRepository(Team);
  private teamMemberRepository = AppDataSource.getRepository(TeamMember);
  private projectTeamRepository = AppDataSource.getRepository(ProjectTeam);
  private taskTeamRepository = AppDataSource.getRepository(TaskTeam);

  async createTeam(userId: string, name: string, description?: string, maxMembers: number = 10) {
    const queryRunner = AppDataSource.createQueryRunner();
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
        role: TeamRoleName.ADMIN,
      });
      await queryRunner.manager.save(member);

      await queryRunner.commitTransaction();
      return team;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async getTeams(userId: string, page: number = 1, limit: number = 10) {
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

    if (teams.length > 0) {
      const teamIds = teams.map((t) => t.id);
      const counts = await AppDataSource.getRepository(Attachment)
        .createQueryBuilder("attachment")
        .select('attachment."teamId"', 'teamId')
        .addSelect('COUNT(attachment.id)', 'count')
        .where('attachment."teamId" IN (:...teamIds)', { teamIds })
        .groupBy('attachment."teamId"')
        .getRawMany();

      const countMap = new Map(counts.map((c) => [c.teamId, parseInt(c.count, 10)]));
      teams.forEach((team) => {
        (team as any).attachmentCount = countMap.get(team.id) || 0;
      });
    }

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

  async getTeamById(teamId: string, userId: string) {
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

  async addMember(teamId: string, adminId: string, userIdToAdd: string, role: TeamRoleName = TeamRoleName.MEMBER) {
    const adminMember = await this.teamMemberRepository.findOne({
      where: { teamId, userId: adminId },
    });

    if (!adminMember || adminMember.role !== TeamRoleName.ADMIN) {
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

    const savedMember = await this.teamMemberRepository.save(newMember);

    // Fetch projects assigned to this team to log "Member added to project"
    const projectTeams = await this.projectTeamRepository.find({
      where: { teamId },
      relations: { project: true },
    });

    for (const pt of projectTeams) {
      if (pt.project) {
        const activity = AppDataSource.getRepository(Activity).create({
          user: "Member",
          action: "added to",
          target: `“${pt.project.name}”`,
          status: "",
        });
        await AppDataSource.getRepository(Activity).save(activity);
      }
    }

    return savedMember;
  }

  async assignProject(teamId: string, adminId: string, projectId: string) {
    const adminMember = await this.teamMemberRepository.findOne({
      where: { teamId, userId: adminId },
    });

    if (!adminMember || adminMember.role !== TeamRoleName.ADMIN) {
      throw { status: 403, message: "Only team admins can assign projects" };
    }

    const existingAssign = await this.projectTeamRepository.findOne({
      where: { teamId, projectId },
    });

    if (existingAssign) {
      throw { status: 400, message: "Project already assigned to team" };
    }

    const project = await AppDataSource.getRepository(Project).findOne({ where: { id: projectId } });
    const projectName = project ? project.name : "Unknown Project";

    const projectTeam = this.projectTeamRepository.create({ teamId, projectId });
    const saved = await this.projectTeamRepository.save(projectTeam);

    const activity = AppDataSource.getRepository(Activity).create({
      user: "Member",
      action: "added to",
      target: `“${projectName}”`,
      status: "",
    });
    await AppDataSource.getRepository(Activity).save(activity);

    return saved;
  }

  async assignTask(teamId: string, adminId: string, taskId: string) {
    const adminMember = await this.teamMemberRepository.findOne({
      where: { teamId, userId: adminId },
    });

    if (!adminMember || adminMember.role !== TeamRoleName.ADMIN) {
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

  async updateCapacity(teamId: string, adminId: string, maxMembers: number) {
    const adminMember = await this.teamMemberRepository.findOne({
      where: { teamId, userId: adminId },
    });

    if (!adminMember || adminMember.role !== TeamRoleName.ADMIN) {
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

  async updateTeam(teamId: string, adminId: string, payload: { name?: string; description?: string }) {
    const adminMember = await this.teamMemberRepository.findOne({
      where: { teamId, userId: adminId },
    });

    if (!adminMember || adminMember.role !== TeamRoleName.ADMIN) {
      throw { status: 403, message: "Only team admins can update team details" };
    }

    const team = await this.teamRepository.findOne({ where: { id: teamId } });
    if (!team) {
      throw { status: 404, message: "Team not found" };
    }

    if (payload.name) team.name = payload.name;
    if (payload.description !== undefined) team.description = payload.description;

    return this.teamRepository.save(team);
  }

  async deleteTeam(teamId: string, adminId: string) {
    const adminMember = await this.teamMemberRepository.findOne({
      where: { teamId, userId: adminId },
    });

    if (!adminMember || adminMember.role !== TeamRoleName.ADMIN) {
      throw { status: 403, message: "Only team admins can delete teams" };
    }

    const team = await this.teamRepository.findOne({ where: { id: teamId } });
    if (!team) {
      throw { status: 404, message: "Team not found" };
    }

    await this.teamRepository.softDelete(teamId);
    return { success: true, message: "Team deleted successfully" };
  }

  async removeMember(teamId: string, adminId: string, userIdToRemove: string) {
    const adminMember = await this.teamMemberRepository.findOne({
      where: { teamId, userId: adminId },
    });

    if (!adminMember || adminMember.role !== TeamRoleName.ADMIN) {
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

export const teamService = new TeamService();
