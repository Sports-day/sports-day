import { Team, CreateTeamInput, UpdateTeamInput } from "../models/Team";
import { TeamRepository } from "../repositories/TeamRepository";
import { GroupRepository } from "../repositories/GroupRepository";
import { UserRepository } from "../repositories/UserRepository";

export class TeamService {
  private teamRepo: TeamRepository;
  private groupRepo: GroupRepository;
  private userRepo: UserRepository;

  constructor(
    teamRepo: TeamRepository,
    groupRepo: GroupRepository,
    userRepo: UserRepository
  ) {
    this.teamRepo = teamRepo;
    this.groupRepo = groupRepo;
    this.userRepo = userRepo;
  }

  getAllTeams(): Team[] {
    return this.teamRepo.getAllTeams();
  }

  getTeamById(id: string): Team | null {
    return this.teamRepo.getTeamById(id);
  }

  createTeam(input: CreateTeamInput): Team {
    // グループIDが指定されている場合、グループが存在するかチェック
    if (input.groupId) {
      const group = this.groupRepo.findById(input.groupId);
      if (!group) {
        throw new Error(`Group with id ${input.groupId} not found`);
      }
    }

    return this.teamRepo.createTeam(input);
  }

  updateTeam(id: string, input: UpdateTeamInput): Team | null {
    const team = this.teamRepo.getTeamById(id);
    if (!team) {
      throw new Error(`Team with id ${id} not found`);
    }

    // グループIDが指定されている場合、グループが存在するかチェック
    if (input.groupId !== undefined) {
      if (input.groupId) {
        const group = this.groupRepo.findById(input.groupId);
        if (!group) {
          throw new Error(`Group with id ${input.groupId} not found`);
        }
      }
    }

    return this.teamRepo.updateTeam(id, input);
  }

  deleteTeam(id: string): boolean {
    const team = this.teamRepo.getTeamById(id);
    if (!team) {
      throw new Error(`Team with id ${id} not found`);
    }

    return this.teamRepo.deleteTeam(id);
  }

  addTeamMember(userIds: string[], teamId: string): Team | null {
    // チームが存在するかチェック
    const team = this.teamRepo.getTeamById(teamId);
    if (!team) {
      throw new Error(`Team with id ${teamId} not found`);
    }

    // 各ユーザーが存在するかチェック
    for (const userId of userIds) {
      const user = this.userRepo.findById(userId);
      if (!user) {
        throw new Error(`User with id ${userId} not found`);
      }
    }

    // 各ユーザーをチームに追加
    const addedUsers: string[] = [];
    const failedUsers: string[] = [];

    for (const userId of userIds) {
      const success = this.teamRepo.addUserToTeam(userId, teamId);
      if (success) {
        addedUsers.push(userId);
      } else {
        failedUsers.push(userId);
      }
    }

    // 結果をログ出力
    if (addedUsers.length > 0) {
      console.log(`✅ Added users to team: ${addedUsers.join(", ")}`);
    }
    if (failedUsers.length > 0) {
      console.log(`⚠️ Users already in team: ${failedUsers.join(", ")}`);
    }

    return this.teamRepo.getTeamById(teamId);
  }

  removeTeamMember(userIds: string[], teamId: string): Team | null {
    // チームが存在するかチェック
    const team = this.teamRepo.getTeamById(teamId);
    if (!team) {
      throw new Error(`Team with id ${teamId} not found`);
    }

    // 各ユーザーが存在するかチェック
    for (const userId of userIds) {
      const user = this.userRepo.findById(userId);
      if (!user) {
        throw new Error(`User with id ${userId} not found`);
      }
    }

    // 各ユーザーをチームから削除
    const removedUsers: string[] = [];
    const failedUsers: string[] = [];

    for (const userId of userIds) {
      const success = this.teamRepo.removeUserFromTeam(userId, teamId);
      if (success) {
        removedUsers.push(userId);
      } else {
        failedUsers.push(userId);
      }
    }

    // 結果をログ出力
    if (removedUsers.length > 0) {
      console.log(`✅ Removed users from team: ${removedUsers.join(", ")}`);
    }
    if (failedUsers.length > 0) {
      console.log(`⚠️ Users not in team: ${failedUsers.join(", ")}`);
    }

    return this.teamRepo.getTeamById(teamId);
  }

  getTeamsByUserId(userId: string): Team[] {
    // ユーザーが存在するかチェック
    const user = this.userRepo.findById(userId);
    if (!user) {
      throw new Error(`User with id ${userId} not found`);
    }

    return this.teamRepo.getTeamsByUserId(userId);
  }

  getUsersByTeamId(teamId: string): string[] {
    // チームが存在するかチェック
    const team = this.teamRepo.getTeamById(teamId);
    if (!team) {
      throw new Error(`Team with id ${teamId} not found`);
    }

    return this.teamRepo.getUsersByTeamId(teamId);
  }
}
