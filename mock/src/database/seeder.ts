import Database from "better-sqlite3";
import { seedData, createSeedData } from "../seed";
import { UserRepository } from "../repositories/UserRepository";
import { GroupRepository } from "../repositories/GroupRepository";
import { SceneRepository } from "../repositories/SceneRepository";
import { SportRepository } from "../repositories/SportRepository";
import { SportSceneRepository } from "../repositories/SportSceneRepository";
import { SportEntryRepository } from "../repositories/SportEntryRepository";

export class DatabaseSeeder {
  private userRepo: UserRepository;
  private groupRepo: GroupRepository;
  private sceneRepo: SceneRepository;
  private sportRepo: SportRepository;
  private sportSceneRepo: SportSceneRepository;
  private sportEntryRepo: SportEntryRepository;

  constructor(db: Database.Database) {
    this.userRepo = new UserRepository(db);
    this.groupRepo = new GroupRepository(db);
    this.sceneRepo = new SceneRepository(db);
    this.sportRepo = new SportRepository(db);
    this.sportSceneRepo = new SportSceneRepository(db);
    this.sportEntryRepo = new SportEntryRepository(db);
  }

  async seed(): Promise<void> {
    console.log("🌱 Seeding database...");

    // 新しいファクトリーパターンを使用
    const seedData = createSeedData();

    // ユーザーをシード
    const users: { [name: string]: string } = {};
    for (const userData of seedData.users) {
      const user = this.userRepo.create({
        name: userData.name,
        email: userData.email,
      });
      users[userData.name] = user.id;
      console.log(`  ✅ Created user: ${user.name} (${user.email})`);
    }

    // グループをシード
    const groups: { [name: string]: string } = {};
    for (const groupData of seedData.groups) {
      const group = this.groupRepo.create({
        name: groupData.name,
      });
      groups[groupData.name] = group.id;
      console.log(`  ✅ Created group: ${group.name}`);
    }

    // シーンをシード
    const scenes: { [name: string]: string } = {};
    for (const sceneData of seedData.scenes) {
      const scene = this.sceneRepo.createScene({
        name: sceneData.name,
        description: sceneData.description,
      });
      scenes[sceneData.name] = scene.id;
      console.log(
        `  ✅ Created scene: ${scene.name} (${
          scene.description || "no description"
        })`
      );
    }

    // スポーツをシード（sceneIdなし）
    const sports: { [name: string]: string } = {};
    for (const sportData of seedData.sports) {
      const sport = this.sportRepo.createSport({
        name: sportData.name,
      });
      sports[sportData.name] = sport.id;
      console.log(`  ✅ Created sport: ${sport.name}`);
    }

    // SportSceneリレーションをシード
    for (const relation of seedData.relations) {
      if (relation.type === "sport_scene") {
        const sport = seedData.sports.find((s) => s.id === relation.sourceId);
        const scene = seedData.scenes.find((sc) => sc.id === relation.targetId);

        if (sport && scene) {
          const dbSportId = sports[sport.name];
          const dbSceneId = scenes[scene.name];

          if (dbSportId && dbSceneId) {
            const sportScene = this.sportSceneRepo.createSportScene({
              sportId: dbSportId,
              sceneId: dbSceneId,
            });
            console.log(
              `  ✅ Created sport-scene: ${sport.name} - ${scene.name}`
            );
          }
        }
      }
    }

    // リレーションをシード
    for (const relation of seedData.relations) {
      if (relation.type === "user_group") {
        const user = seedData.users.find((u) => u.id === relation.sourceId);
        const group = seedData.groups.find((g) => g.id === relation.targetId);

        if (user && group) {
          // データベースに保存されたIDを使用
          const dbUserId = users[user.name];
          const dbGroupId = groups[group.name];

          if (dbUserId && dbGroupId) {
            this.groupRepo.addUserToGroup(dbUserId, dbGroupId);
            console.log(`  ✅ Assigned ${user.name} to ${group.name}`);
          }
        }
      }
    }

    console.log("✅ Database seeding completed");
  }

  // 後方互換性のためのメソッド（古い方式）
  async seedLegacy(): Promise<void> {
    console.log("🌱 Seeding database (legacy mode)...");

    // ユーザーをシード
    const users: { [name: string]: string } = {};
    for (const userData of seedData.users) {
      const user = this.userRepo.create(userData);
      users[userData.name] = user.id;
      console.log(`  ✅ Created user: ${user.name} (${user.email})`);
    }

    // グループをシード
    const groups: { [name: string]: string } = {};
    for (const groupData of seedData.groups) {
      const group = this.groupRepo.create(groupData);
      groups[groupData.name] = group.id;
      console.log(`  ✅ Created group: ${group.name}`);
    }

    // シーンをシード
    const scenes: { [name: string]: string } = {};
    for (const sceneData of seedData.scenes) {
      const scene = this.sceneRepo.createScene({
        name: sceneData.name,
        description: sceneData.description,
      });
      scenes[sceneData.name] = scene.id;
      console.log(
        `  ✅ Created scene: ${scene.name} (${
          scene.description || "no description"
        })`
      );
    }

    // スポーツをシード
    const sports: { [name: string]: string } = {};
    for (const sportData of seedData.sports) {
      const sport = this.sportRepo.createSport({
        name: sportData.name,
      });
      sports[sportData.name] = sport.id;
      console.log(`  ✅ Created sport: ${sport.name}`);
    }

    // ユーザー・グループ割り当てをシード
    for (const assignment of seedData.userGroupAssignments) {
      const userId = users[assignment.userName];
      const groupId = groups[assignment.groupName];

      if (userId && groupId) {
        this.groupRepo.addUserToGroup(userId, groupId);
        console.log(
          `  ✅ Assigned ${assignment.userName} to ${assignment.groupName}`
        );
      }
    }

    console.log("✅ Database seeding completed (legacy mode)");
  }

  async clear(): Promise<void> {
    console.log("🧹 Clearing database...");

    const db = this.userRepo["db"];

    // Disable foreign key checks temporarily
    db.pragma("foreign_keys = OFF");

    // Clear all tables
    db.prepare("DELETE FROM sport_entries").run();
    db.prepare("DELETE FROM sport_scenes").run();
    db.prepare("DELETE FROM user_groups").run();
    db.prepare("DELETE FROM users").run();
    db.prepare("DELETE FROM groups").run();
    db.prepare("DELETE FROM sports").run();
    db.prepare("DELETE FROM scenes").run();

    // Re-enable foreign key checks
    db.pragma("foreign_keys = ON");

    console.log("✅ Database cleared");
  }
}
