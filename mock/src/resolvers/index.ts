import { userResolvers } from "./user";
import { groupResolvers } from "./group";

// Combine all resolvers
export const resolvers = {
  Query: {
    ...userResolvers.Query,
    ...groupResolvers.Query,
  },
  Mutation: {
    ...userResolvers.Mutation,
    ...groupResolvers.Mutation,
  },
  User: {
    ...userResolvers.User,
  },
  Group: {
    ...groupResolvers.Group,
  },
};
