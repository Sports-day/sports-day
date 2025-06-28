import DataLoader from "dataloader";
import { UserService } from "../services/UserService";
import { GroupService } from "../services/GroupService";
import { SportService } from "../services/SportService";
import { SceneService } from "../services/SceneService";

// User data loader
export const createUserLoader = (userService: UserService) => {
  return new DataLoader(async (userIds: readonly string[]) => {
    return userIds.map((id) => userService.getUserById(id));
  });
};

// Group data loader
export const createGroupLoader = (groupService: GroupService) => {
  return new DataLoader(async (groupIds: readonly string[]) => {
    return groupIds.map((id) => groupService.getGroupById(id));
  });
};

// Groups by user ID loader
export const createUserGroupsLoader = (groupService: GroupService) => {
  return new DataLoader(async (userIds: readonly string[]) => {
    return userIds.map((userId) => groupService.getGroupsByUserId(userId));
  });
};

// Users by group ID loader
export const createGroupUsersLoader = (
  groupService: GroupService,
  userService: UserService
) => {
  return new DataLoader(async (groupIds: readonly string[]) => {
    return groupIds.map((groupId) => {
      const userIds = groupService.getUserIdsByGroupId(groupId);
      return userIds
        .map((userId) => userService.getUserById(userId))
        .filter(Boolean);
    });
  });
};

// Sport data loader
export const createSportLoader = (sportService: SportService) => {
  return new DataLoader(async (sportIds: readonly string[]) => {
    return sportIds.map((id) => sportService.getSportById(id));
  });
};

// Scene data loader
export const createSceneLoader = (sceneService: SceneService) => {
  return new DataLoader(async (sceneIds: readonly string[]) => {
    return sceneIds.map((id) => sceneService.getSceneById(id));
  });
};

// Sports by scene ID loader
export const createSceneSportsLoader = (sportService: SportService) => {
  return new DataLoader(async (sceneIds: readonly string[]) => {
    return sceneIds.map((sceneId) => sportService.getSportsBySceneId(sceneId));
  });
};
