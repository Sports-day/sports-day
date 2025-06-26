import { userResolvers } from "./user";
import { groupResolvers } from "./group";
import { teamResolvers } from "./team";

// Combine all resolvers
export const resolvers = {
  Query: {
    ...userResolvers.Query,
    ...groupResolvers.Query,
    ...teamResolvers.Query,
  },
  Mutation: {
    ...userResolvers.Mutation,
    ...groupResolvers.Mutation,
    ...teamResolvers.Mutation,
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
