import { UserService } from "../services/UserService";
import { GroupService } from "../services/GroupService";
import { TeamService } from "../services/TeamService";

// Services will be injected via context
export const userResolvers = {
  Query: {
    // Get all users
    users: (_: any, __: any, context: { userService: UserService }) => {
      return context.userService.getAllUsers();
    },

    // Get user by ID
    user: (
      _: any,
      { id }: { id: string },
      context: { userService: UserService }
    ) => {
      return context.userService.getUserById(id);
    },

    // Get user by email
    userByEmail: (
      _: any,
      { email }: { email: string },
      context: { userService: UserService }
    ) => {
      return context.userService.getUserByEmail(email);
    },
  },

  Mutation: {
    // Create new user
    createUser: (
      _: any,
      { input }: { input: { name: string; email: string } },
      context: { userService: UserService }
    ) => {
      try {
        return context.userService.createUser(input);
      } catch (error) {
        throw new Error(
          `Failed to create user: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      }
    },

    // Update user
    updateUser: (
      _: any,
      { id, input }: { id: string; input: { name?: string; email?: string } },
      context: { userService: UserService }
    ) => {
      try {
        return context.userService.updateUser(id, input);
      } catch (error) {
        throw new Error(
          `Failed to update user: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      }
    },

    // Delete user
    deleteUser: (
      _: any,
      { id }: { id: string },
      context: { userService: UserService }
    ) => {
      try {
        return context.userService.deleteUser(id);
      } catch (error) {
        throw new Error(
          `Failed to delete user: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      }
    },
  },

  User: {
    // Resolve groups field for User
    groups: (parent: any, _: any, context: { groupService: GroupService }) => {
      return context.groupService.getGroupsByUserId(parent.id);
    },
    // Resolve teams field for User
    teams: (parent: any, _: any, context: { teamService: TeamService }) => {
      return context.teamService.getTeamsByUserId(parent.id);
    },
  },
};
