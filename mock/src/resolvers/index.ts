import { userResolvers } from "./user";
import { groupResolvers } from "./group";
import { teamResolvers } from "./team";
import { sceneResolvers } from "./scene";
import { sportResolvers } from "./sport";

// Combine all resolvers
export const resolvers = {
  Query: {
    ...userResolvers.Query,
    ...groupResolvers.Query,
    ...teamResolvers.Query,
    ...sceneResolvers.Query,
    ...sportResolvers.Query,
  },
  Mutation: {
    ...userResolvers.Mutation,
    ...groupResolvers.Mutation,
    ...teamResolvers.Mutation,
    ...sceneResolvers.Mutation,
    ...sportResolvers.Mutation,
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
};
