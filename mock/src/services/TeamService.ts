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

  addUserToTeam(userId: string, teamId: string): Team | null {
    // ユーザーが存在するかチェック
    const user = this.userRepo.findById(userId);
    if (!user) {
      throw new Error(`User with id ${userId} not found`);
    }

    // チームが存在するかチェック
    const team = this.teamRepo.getTeamById(teamId);
    if (!team) {
      throw new Error(`Team with id ${teamId} not found`);
    }

    const success = this.teamRepo.addUserToTeam(userId, teamId);
    if (!success) {
      throw new Error(`User ${userId} is already a member of team ${teamId}`);
    }

    return this.teamRepo.getTeamById(teamId);
  }

  removeUserFromTeam(userId: string, teamId: string): Team | null {
    // ユーザーが存在するかチェック
    const user = this.userRepo.findById(userId);
    if (!user) {
      throw new Error(`User with id ${userId} not found`);
    }

    // チームが存在するかチェック
    const team = this.teamRepo.getTeamById(teamId);
    if (!team) {
      throw new Error(`Team with id ${teamId} not found`);
    }

    const success = this.teamRepo.removeUserFromTeam(userId, teamId);
    if (!success) {
      throw new Error(`User ${userId} is not a member of team ${teamId}`);
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
