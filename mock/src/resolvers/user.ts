import { userStore } from "../models/User";

export const userResolvers = {
  Query: {
    // Get all users
    users: () => {
      return userStore.getAllUsers();
    },

    // Get user by ID
    user: (_: any, { id }: { id: string }) => {
      return userStore.getUserById(id);
    },

    // Get user by email
    userByEmail: (_: any, { email }: { email: string }) => {
      return userStore.getUserByEmail(email);
    },
  },

  Mutation: {
    // Create new user
    createUser: (
      _: any,
      { input }: { input: { name: string; email: string } }
    ) => {
      try {
        return userStore.createUser(input);
      } catch (error) {
        throw new Error(
          `Failed to create user: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      }
    },

    // Update user
    updateUser: (
      _: any,
      { id, input }: { id: string; input: { name?: string; email?: string } }
    ) => {
      try {
        return userStore.updateUser(id, input);
      } catch (error) {
        throw new Error(
          `Failed to update user: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      }
    },

    // Delete user
    deleteUser: (_: any, { id }: { id: string }) => {
      try {
        return userStore.deleteUser(id);
      } catch (error) {
        throw new Error(
          `Failed to delete user: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      }
    },
  },
};
