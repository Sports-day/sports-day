import { GroupService } from "../services/GroupService";
import { UserService } from "../services/UserService";

// Services will be injected via context
export const groupResolvers = {
  Query: {
    // Get all groups
    groups: (_: any, __: any, context: { groupService: GroupService }) => {
      return context.groupService.getAllGroups();
    },

    // Get group by ID
    group: (
      _: any,
      { id }: { id: string },
      context: { groupService: GroupService }
    ) => {
      return context.groupService.getGroupById(id);
    },
  },

  Mutation: {
    // Create new group
    createGroup: (
      _: any,
      { input }: { input: { name: string } },
      context: { groupService: GroupService }
    ) => {
      try {
        return context.groupService.createGroup(input);
      } catch (error) {
        throw new Error(
          `Failed to create group: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      }
    },

    // Update group
    updateGroup: (
      _: any,
      { id, input }: { id: string; input: { name?: string } },
      context: { groupService: GroupService }
    ) => {
      try {
        return context.groupService.updateGroup(id, input);
      } catch (error) {
        throw new Error(
          `Failed to update group: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      }
    },

    // Delete group
    deleteGroup: (
      _: any,
      { id }: { id: string },
      context: { groupService: GroupService }
    ) => {
      try {
        return context.groupService.deleteGroup(id);
      } catch (error) {
        throw new Error(
          `Failed to delete group: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      }
    },

    // Add user to group
    addUserToGroup: (
      _: any,
      { userId, groupId }: { userId: string; groupId: string },
      context: { groupService: GroupService; userService: UserService }
    ) => {
      try {
        // Check if user exists
        const user = context.userService.getUserById(userId);
        if (!user) {
          throw new Error(`User with id ${userId} not found`);
        }

        return context.groupService.addUserToGroup(userId, groupId);
      } catch (error) {
        throw new Error(
          `Failed to add user to group: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      }
    },

    // Remove user from group
    removeUserFromGroup: (
      _: any,
      { userId, groupId }: { userId: string; groupId: string },
      context: { groupService: GroupService }
    ) => {
      try {
        return context.groupService.removeUserFromGroup(userId, groupId);
      } catch (error) {
        throw new Error(
          `Failed to remove user from group: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      }
    },
  },

  Group: {
    // Resolve users field for Group
    users: (
      parent: any,
      _: any,
      context: { groupService: GroupService; userService: UserService }
    ) => {
      const userIds = context.groupService.getUserIdsByGroupId(parent.id);
      return userIds
        .map((userId) => context.userService.getUserById(userId))
        .filter(Boolean);
    },
  },
};
