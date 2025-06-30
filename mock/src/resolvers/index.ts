import { userResolvers } from "./user";
import { groupResolvers } from "./group";
import { teamResolvers } from "./team";
import { sceneResolvers } from "./scene";
import { sportResolvers } from "./sport";
import { sportSceneResolvers } from "./sportScene";
import { sportEntryResolvers } from "./sportEntry";

// Combine all resolvers
export const resolvers = {
  Query: {
    ...userResolvers.Query,
    ...groupResolvers.Query,
    ...teamResolvers.Query,
    ...sceneResolvers.Query,
    ...sportResolvers.Query,
    ...sportSceneResolvers.Query,
    ...sportEntryResolvers.Query,
  },
  Mutation: {
    ...userResolvers.Mutation,
    ...groupResolvers.Mutation,
    ...teamResolvers.Mutation,
    ...sceneResolvers.Mutation,
    ...sportResolvers.Mutation,
    ...sportSceneResolvers.Mutation,
    ...sportEntryResolvers.Mutation,
  },
  User: {
    ...userResolvers.User,
  },
  Group: {
    ...groupResolvers.Group,
  },
  Team: {
    ...teamResolvers.Team,
  },
  Scene: {
    ...sceneResolvers.Scene,
  },
  Sport: {
    ...sportResolvers.Sport,
  },
  SportScene: {
    ...sportSceneResolvers.SportScene,
  },
  SportEntry: {
    ...sportEntryResolvers.SportEntry,
  },
};
