import { describe, it, expect, vi, beforeEach } from 'vitest';
import { teamService } from '../../services/team.service';
import { AppDataSource } from '../../utils/data-source';
import { TeamRoleName } from '../../entities/TeamMember.entity';

vi.mock('../../utils/data-source', () => ({
  AppDataSource: {
    getRepository: vi.fn(),
    createQueryRunner: vi.fn(),
  },
}));

describe('teamService', () => {
  const mockTeamRepo = {
    create: vi.fn(),
    save: vi.fn(),
    findOne: vi.fn(),
    createQueryBuilder: vi.fn(),
    softDelete: vi.fn(),
  };

  const mockTeamMemberRepo = {
    create: vi.fn(),
    save: vi.fn(),
    findOne: vi.fn(),
    remove: vi.fn(),
  };

  const mockProjectTeamRepo = {
    create: vi.fn(),
    save: vi.fn(),
    findOne: vi.fn(),
  };

  const mockTaskTeamRepo = {
    create: vi.fn(),
    save: vi.fn(),
    findOne: vi.fn(),
  };

  const mockQueryRunner = {
    connect: vi.fn(),
    startTransaction: vi.fn(),
    commitTransaction: vi.fn(),
    rollbackTransaction: vi.fn(),
    release: vi.fn(),
    manager: {
      save: vi.fn(),
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (teamService as any).teamRepository = mockTeamRepo;
    (teamService as any).teamMemberRepository = mockTeamMemberRepo;
    (teamService as any).projectTeamRepository = mockProjectTeamRepo;
    (teamService as any).taskTeamRepository = mockTaskTeamRepo;
    
    (AppDataSource.createQueryRunner as any).mockReturnValue(mockQueryRunner);
  });

  describe('createTeam', () => {
    it('should create a team and add the creator as ADMIN within a transaction', async () => {
      const mockTeam = { id: 'team-1', name: 'Test Team', maxMembers: 10 };
      const mockMember = { teamId: 'team-1', userId: 'user-1', role: TeamRoleName.ADMIN };

      mockTeamRepo.create.mockReturnValue(mockTeam);
      mockTeamMemberRepo.create.mockReturnValue(mockMember);

      const result = await teamService.createTeam('user-1', 'Test Team', 'Desc', 10);

      expect(mockQueryRunner.connect).toHaveBeenCalled();
      expect(mockQueryRunner.startTransaction).toHaveBeenCalled();
      expect(mockTeamRepo.create).toHaveBeenCalledWith({ name: 'Test Team', description: 'Desc', maxMembers: 10 });
      expect(mockTeamMemberRepo.create).toHaveBeenCalledWith({ teamId: 'team-1', userId: 'user-1', role: TeamRoleName.ADMIN });
      expect(mockQueryRunner.manager.save).toHaveBeenCalledWith(mockTeam);
      expect(mockQueryRunner.manager.save).toHaveBeenCalledWith(mockMember);
      expect(mockQueryRunner.commitTransaction).toHaveBeenCalled();
      expect(mockQueryRunner.release).toHaveBeenCalled();
      expect(result).toEqual(mockTeam);
    });

    it('should rollback transaction on error', async () => {
      mockTeamRepo.create.mockReturnValue({});
      mockQueryRunner.manager.save.mockRejectedValue(new Error('DB Error'));

      await expect(teamService.createTeam('user-1', 'Test Team')).rejects.toThrow('DB Error');

      expect(mockQueryRunner.rollbackTransaction).toHaveBeenCalled();
      expect(mockQueryRunner.release).toHaveBeenCalled();
    });
  });

  describe('getTeams', () => {
    it('should fetch paginated teams and return meta data', async () => {
      const mockQueryBuilder = {
        innerJoin: vi.fn().mockReturnThis(),
        leftJoinAndSelect: vi.fn().mockReturnThis(),
        skip: vi.fn().mockReturnThis(),
        take: vi.fn().mockReturnThis(),
        getManyAndCount: vi.fn().mockResolvedValue([[{ id: 'team-1' }], 1]),
      };
      mockTeamRepo.createQueryBuilder.mockReturnValue(mockQueryBuilder);

      const result = await teamService.getTeams('user-1', 1, 10);

      expect(mockQueryBuilder.skip).toHaveBeenCalledWith(0);
      expect(mockQueryBuilder.take).toHaveBeenCalledWith(10);
      expect(result.data).toEqual([{ id: 'team-1' }]);
      expect(result.meta).toEqual({ total: 1, page: 1, limit: 10, totalPages: 1 });
    });
  });

  describe('getTeamById', () => {
    it('should return team if user is a member', async () => {
      const mockTeam = { id: 'team-1', members: [{ userId: 'user-1' }] };
      const mockQueryBuilder = {
        leftJoinAndSelect: vi.fn().mockReturnThis(),
        where: vi.fn().mockReturnThis(),
        getOne: vi.fn().mockResolvedValue(mockTeam),
      };
      mockTeamRepo.createQueryBuilder.mockReturnValue(mockQueryBuilder);

      const result = await teamService.getTeamById('team-1', 'user-1');
      expect(result).toEqual(mockTeam);
    });

    it('should throw 403 if user is not a member', async () => {
      const mockTeam = { id: 'team-1', members: [{ userId: 'user-2' }] };
      const mockQueryBuilder = {
        leftJoinAndSelect: vi.fn().mockReturnThis(),
        where: vi.fn().mockReturnThis(),
        getOne: vi.fn().mockResolvedValue(mockTeam),
      };
      mockTeamRepo.createQueryBuilder.mockReturnValue(mockQueryBuilder);

      await expect(teamService.getTeamById('team-1', 'user-1')).rejects.toEqual({ status: 403, message: 'Access denied' });
    });

    it('should throw 404 if team not found', async () => {
      const mockQueryBuilder = {
        leftJoinAndSelect: vi.fn().mockReturnThis(),
        where: vi.fn().mockReturnThis(),
        getOne: vi.fn().mockResolvedValue(null),
      };
      mockTeamRepo.createQueryBuilder.mockReturnValue(mockQueryBuilder);

      await expect(teamService.getTeamById('team-1', 'user-1')).rejects.toEqual({ status: 404, message: 'Team not found' });
    });
  });

  describe('addMember', () => {
    it('should add member if admin and capacity not reached', async () => {
      mockTeamMemberRepo.findOne.mockResolvedValueOnce({ role: TeamRoleName.ADMIN }); // Admin check
      mockTeamRepo.findOne.mockResolvedValueOnce({ id: 'team-1', maxMembers: 5, members: [{ userId: 'user-1' }] }); // Team capacity check
      mockTeamMemberRepo.findOne.mockResolvedValueOnce(null); // Existing member check
      
      const newMember = { teamId: 'team-1', userId: 'user-2', role: TeamRoleName.MEMBER };
      mockTeamMemberRepo.create.mockReturnValue(newMember);
      mockTeamMemberRepo.save.mockResolvedValue(newMember);

      const result = await teamService.addMember('team-1', 'user-1', 'user-2');
      expect(result).toEqual(newMember);
    });

    it('should throw 403 if not admin', async () => {
      mockTeamMemberRepo.findOne.mockResolvedValueOnce({ role: TeamRoleName.MEMBER });
      await expect(teamService.addMember('team-1', 'user-1', 'user-2')).rejects.toEqual({ status: 403, message: 'Only team admins can add members' });
    });

    it('should throw 400 if team capacity reached', async () => {
      mockTeamMemberRepo.findOne.mockResolvedValueOnce({ role: TeamRoleName.ADMIN });
      mockTeamRepo.findOne.mockResolvedValueOnce({ id: 'team-1', maxMembers: 1, members: [{ userId: 'user-1' }] });
      await expect(teamService.addMember('team-1', 'user-1', 'user-2')).rejects.toEqual({ status: 400, message: 'Team capacity reached. Increase capacity to add more members.' });
    });
  });

  describe('removeMember', () => {
    it('should remove member if admin', async () => {
      mockTeamMemberRepo.findOne.mockResolvedValueOnce({ role: TeamRoleName.ADMIN }); // Admin check
      const memberToRemove = { teamId: 'team-1', userId: 'user-2' };
      mockTeamMemberRepo.findOne.mockResolvedValueOnce(memberToRemove); // Member to remove exists

      await teamService.removeMember('team-1', 'user-1', 'user-2');
      expect(mockTeamMemberRepo.remove).toHaveBeenCalledWith(memberToRemove);
    });

    it('should throw 400 if admin tries to remove themselves', async () => {
      mockTeamMemberRepo.findOne.mockResolvedValueOnce({ role: TeamRoleName.ADMIN });
      await expect(teamService.removeMember('team-1', 'user-1', 'user-1')).rejects.toEqual({ status: 400, message: 'Admins cannot remove themselves. Assign another admin first or delete the team.' });
    });
  });
});
