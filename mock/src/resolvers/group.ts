import { groupStore } from "../models/Group";
import { userStore } from "../models/User";

export const groupResolvers = {
  Query: {
    // Get all groups
    groups: () => {
      return groupStore.getAllGroups();
    },

    // Get group by ID
    group: (_: any, { id }: { id: string }) => {
      return groupStore.getGroupById(id);
    },
  },

  Mutation: {
    // Create new group
    createGroup: (_: any, { input }: { input: { name: string } }) => {
      try {
        return groupStore.createGroup(input);
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
      { id, input }: { id: string; input: { name?: string } }
    ) => {
      try {
        return groupStore.updateGroup(id, input);
      } catch (error) {
        throw new Error(
          `Failed to update group: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      }
    },

    // Delete group
    deleteGroup: (_: any, { id }: { id: string }) => {
      try {
        return groupStore.deleteGroup(id);
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
      { userId, groupId }: { userId: string; groupId: string }
    ) => {
      try {
        // Check if user exists
        const user = userStore.getUserById(userId);
        if (!user) {
          throw new Error(`User with id ${userId} not found`);
        }

        return groupStore.addUserToGroup(userId, groupId);
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
      { userId, groupId }: { userId: string; groupId: string }
    ) => {
      try {
        return groupStore.removeUserFromGroup(userId, groupId);
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
    users: (parent: any) => {
      const userIds = groupStore.getUserIdsByGroupId(parent.id);
      return userIds
        .map((userId) => userStore.getUserById(userId))
        .filter(Boolean);
    },
  },
};
