import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { typeDefs } from "./schema";
import { resolvers } from "./resolvers";
import { userStore } from "./models/User";
import { groupStore } from "./models/Group";

const PORT = process.env.PORT || 4000;

async function startServer() {
  // Create Apollo Server
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    csrfPrevention: false,
    formatError: (error) => {
      console.error("GraphQL Error:", error);
      return {
        message: error.message,
        path: error.path,
      };
    },
  });

  // Passing an ApolloServer instance to the `startStandaloneServer` function:
  //  1. creates an Express app
  //  2. installs your ApolloServer instance as middleware
  //  3. prepares your app to handle incoming requests
  const { url } = await startStandaloneServer(server, {
    listen: { port: Number(PORT) },
  });

  console.log(`🚀 Mock GraphQL Server ready at: ${url}`);
  console.log(`📊 GraphQL Playground available at: ${url}`);
  console.log(
    `💚 Health check available at: ${url.replace("/graphql", "/health")}`
  );

  // Auto-assign users to groups (5 users per group)
  const assignUsersToGroups = () => {
    const users = userStore.getAllUsers();
    const groups = groupStore.getAllGroups();

    if (users.length >= 10 && groups.length >= 2) {
      // Assign first 5 users to サクラ group
      const sakuraGroup = groups.find((g) => g.name === "サクラ");
      if (sakuraGroup) {
        for (let i = 0; i < 5; i++) {
          groupStore.addUserToGroup(users[i].id, sakuraGroup.id);
        }
      }

      // Assign next 5 users to アサヒ group
      const asahiGroup = groups.find((g) => g.name === "アサヒ");
      if (asahiGroup) {
        for (let i = 5; i < 10; i++) {
          groupStore.addUserToGroup(users[i].id, asahiGroup.id);
        }
      }

      console.log(
        "✅ Users assigned to groups: 5 users to サクラ, 5 users to アサヒ"
      );
    }
  };

  // Auto-assign users to groups after server starts
  setTimeout(assignUsersToGroups, 100);
}

startServer().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});
