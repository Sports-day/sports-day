import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { typeDefs } from "./schema";
import { resolvers } from "./resolvers";
import { dbManager } from "./database";
import { DatabaseSeeder } from "./database/seeder";
import { UserRepository } from "./repositories/UserRepository";
import { GroupRepository } from "./repositories/GroupRepository";
import { TeamRepository } from "./repositories/TeamRepository";
import { SceneRepository } from "./repositories/SceneRepository";
import { SportRepository } from "./repositories/SportRepository";
import { SportSceneRepository } from "./repositories/SportSceneRepository";
import { SportEntryRepository } from "./repositories/SportEntryRepository";
import { UserService } from "./services/UserService";
import { GroupService } from "./services/GroupService";
import { TeamService } from "./services/TeamService";
import { SceneService } from "./services/SceneService";
import { SportService } from "./services/SportService";
import { SportSceneService } from "./services/SportSceneService";
import { SportEntryService } from "./services/SportEntryService";
import {
  createUserLoader,
  createGroupLoader,
  createTeamLoader,
  createUserGroupsLoader,
  createGroupUsersLoader,
  createSportLoader,
  createSceneLoader,
  createSportScenesBySportLoader,
  createSportScenesBySceneLoader,
  createSceneSportsLoader,
} from "./dataloaders";

const PORT = process.env.PORT || 4000;

async function startServer() {
  // Initialize database
  const db = dbManager.initialize();

  // Initialize repositories
  const userRepo = new UserRepository(db);
  const groupRepo = new GroupRepository(db);
  const teamRepo = new TeamRepository(db);
  const sceneRepo = new SceneRepository(db);
  const sportRepo = new SportRepository(db);
  const sportSceneRepo = new SportSceneRepository(db);
  const sportEntryRepo = new SportEntryRepository(db);

  // Initialize services
  const userService = new UserService(userRepo);
  const groupService = new GroupService(groupRepo);
  const teamService = new TeamService(teamRepo, groupRepo, userRepo);
  const sceneService = new SceneService(sceneRepo);
  const sportService = new SportService(sportRepo);
  const sportSceneService = new SportSceneService(sportSceneRepo);
  const sportEntryService = new SportEntryService(sportEntryRepo);

  // Initialize seeder and seed data
  const seeder = new DatabaseSeeder(db);
  await seeder.seed();

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
    context: async () => ({
      userService,
      groupService,
      teamService,
      sceneService,
      sportService,
      sportSceneService,
      sportEntryService,
      userLoader: createUserLoader(userService),
      groupLoader: createGroupLoader(groupService),
      teamLoader: createTeamLoader(teamService),
      userGroupsLoader: createUserGroupsLoader(groupService),
      groupUsersLoader: createGroupUsersLoader(groupService, userService),
      sportLoader: createSportLoader(sportService),
      sceneLoader: createSceneLoader(sceneService),
      sportScenesBySportLoader:
        createSportScenesBySportLoader(sportSceneService),
      sportScenesBySceneLoader:
        createSportScenesBySceneLoader(sportSceneService),
      sceneSportsLoader: createSceneSportsLoader(
        sportSceneService,
        sportService
      ),
    }),
  });

  console.log(`🚀 Mock GraphQL Server ready at: ${url}`);
  console.log(`📊 GraphQL Playground available at: ${url}`);
  console.log(
    `💚 Health check available at: ${url.replace("/graphql", "/health")}`
  );

  // Graceful shutdown
  process.on("SIGINT", () => {
    console.log("\n🛑 Shutting down server...");
    dbManager.close();
    process.exit(0);
  });

  process.on("SIGTERM", () => {
    console.log("\n🛑 Shutting down server...");
    dbManager.close();
    process.exit(0);
  });
}

startServer().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});
