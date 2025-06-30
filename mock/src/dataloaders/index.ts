import DataLoader from "dataloader";
import { UserService } from "../services/UserService";
import { GroupService } from "../services/GroupService";
import { TeamService } from "../services/TeamService";
import { SportService } from "../services/SportService";
import { SceneService } from "../services/SceneService";
import { SportSceneService } from "../services/SportSceneService";

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

// Team data loader
export const createTeamLoader = (teamService: TeamService) => {
  return new DataLoader(async (teamIds: readonly string[]) => {
    return teamIds.map((id) => teamService.getTeamById(id));
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

// SportScenes by sport ID loader
export const createSportScenesBySportLoader = (
  sportSceneService: SportSceneService
) => {
  return new DataLoader(async (sportIds: readonly string[]) => {
    return sportIds.map((sportId) =>
      sportSceneService.getSportScenesBySportId(sportId)
    );
  });
};

// SportScenes by scene ID loader
export const createSportScenesBySceneLoader = (
  sportSceneService: SportSceneService
) => {
  return new DataLoader(async (sceneIds: readonly string[]) => {
    return sceneIds.map((sceneId) =>
      sportSceneService.getSportScenesBySceneId(sceneId)
    );
  });
};

// Sports by scene ID loader
export const createSceneSportsLoader = (
  sportSceneService: SportSceneService,
  sportService: SportService
) => {
  return new DataLoader(async (sceneIds: readonly string[]) => {
    return sceneIds.map(async (sceneId) => {
      const sportScenes = await sportSceneService.getSportScenesBySceneId(
        sceneId
      );
      const sports = await Promise.all(
        sportScenes.map((sportScene) =>
          sportService.getSportById(sportScene.sportId)
        )
      );
      return sports.filter(Boolean);
    });
  });
};
