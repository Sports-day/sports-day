import { userResolvers } from "./user";
import { groupResolvers } from "./group";
import { teamResolvers } from "./team";
import { sceneResolvers } from "./scene";

// Combine all resolvers
export const resolvers = {
  Query: {
    ...userResolvers.Query,
    ...groupResolvers.Query,
    ...teamResolvers.Query,
    ...sceneResolvers.Query,
  },
  Mutation: {
    ...userResolvers.Mutation,
    ...groupResolvers.Mutation,
    ...teamResolvers.Mutation,
    ...sceneResolvers.Mutation,
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
};
