import { TeamService } from "../services/TeamService";

export const teamResolvers = {
  Query: {
    teams: (_: any, __: any, context: { teamService: TeamService }) => {
      return context.teamService.getAllTeams();
    },
    team: (
      _: any,
      { id }: { id: string },
      context: { teamService: TeamService }
    ) => {
      return context.teamService.getTeamById(id);
    },
  },
  Mutation: {
    createTeam: (
      _: any,
      { input }: { input: { name: string; groupId?: string } },
      context: { teamService: TeamService }
    ) => {
      return context.teamService.createTeam(input);
    },
    updateTeam: (
      _: any,
      { id, input }: { id: string; input: { name?: string; groupId?: string } },
      context: { teamService: TeamService }
    ) => {
      return context.teamService.updateTeam(id, input);
    },
    deleteTeam: (
      _: any,
      { id }: { id: string },
      context: { teamService: TeamService }
    ) => {
      return context.teamService.deleteTeam(id);
    },
    addTeamMember: (
      _: any,
      { userIds, teamId }: { userIds: string[]; teamId: string },
      context: { teamService: TeamService }
    ) => {
      return context.teamService.addTeamMember(userIds, teamId);
    },
    removeTeamMember: (
      _: any,
      { userIds, teamId }: { userIds: string[]; teamId: string },
      context: { teamService: TeamService }
    ) => {
      return context.teamService.removeTeamMember(userIds, teamId);
    },
  },
  Team: {
    users: async (parent: any, _: any, context: { userService: any }) => {
      const userIds = Array.from(parent.userIds);
      if (userIds.length === 0) return [];

      return userIds
        .map((id) => context.userService.getUserById(id))
        .filter(Boolean);
    },
    group: async (parent: any, _: any, context: { groupService: any }) => {
      if (!parent.groupId) return null;
      return context.groupService.getGroupById(parent.groupId);
    },
  },
};
