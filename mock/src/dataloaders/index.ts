import DataLoader from "dataloader";
import { userStore } from "../models/User";
import { groupStore } from "../models/Group";

// User data loader
export const userLoader = new DataLoader(async (userIds: readonly string[]) => {
  return userIds.map((id) => userStore.getUserById(id));
});

// Group data loader
export const groupLoader = new DataLoader(
  async (groupIds: readonly string[]) => {
    return groupIds.map((id) => groupStore.getGroupById(id));
  }
);

// Groups by user ID loader
export const userGroupsLoader = new DataLoader(
  async (userIds: readonly string[]) => {
    return userIds.map((userId) => groupStore.getGroupsByUserId(userId));
  }
);

// Users by group ID loader
export const groupUsersLoader = new DataLoader(
  async (groupIds: readonly string[]) => {
    return groupIds.map((groupId) => {
      const userIds = groupStore.getUserIdsByGroupId(groupId);
      return userIds
        .map((userId) => userStore.getUserById(userId))
        .filter(Boolean);
    });
  }
);
