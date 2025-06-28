import Database from "better-sqlite3";
import { seedData, createSeedData } from "../seed";
import { UserRepository } from "../repositories/UserRepository";
import { GroupRepository } from "../repositories/GroupRepository";
import { TeamRepository } from "../repositories/TeamRepository";
import { SceneRepository } from "../repositories/SceneRepository";
import { SportRepository } from "../repositories/SportRepository";

export class DatabaseSeeder {
  private userRepo: UserRepository;
  private groupRepo: GroupRepository;
  private teamRepo: TeamRepository;
  private sceneRepo: SceneRepository;
  private sportRepo: SportRepository;

  constructor(db: Database.Database) {
    this.userRepo = new UserRepository(db);
    this.groupRepo = new GroupRepository(db);
    this.teamRepo = new TeamRepository(db);
    this.sceneRepo = new SceneRepository(db);
    this.sportRepo = new SportRepository(db);
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

    // チームをシード
    const teams: { [name: string]: string } = {};
    for (const teamData of seedData.teams) {
      // グループ名からグループIDを取得
      const groupId = teamData.groupId ? groups[teamData.groupId] : undefined;

      const team = this.teamRepo.createTeam({
        name: teamData.name,
        groupId: groupId,
      });
      teams[teamData.name] = team.id;
      console.log(
        `  ✅ Created team: ${team.name} (group: ${teamData.groupId || "none"})`
      );
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
    for (const sportData of seedData.sports) {
      // シーン名からシーンIDを取得
      const sceneId = sportData.sceneId ? scenes[sportData.sceneId] : undefined;

      if (sceneId) {
        const sport = this.sportRepo.createSport({
          name: sportData.name,
          sceneId: sceneId,
        });
        console.log(
          `  ✅ Created sport: ${sport.name} (scene: ${sportData.sceneId})`
        );
      } else {
        console.warn(
          `  ⚠️  Skipped sport: ${sportData.name} (scene not found: ${sportData.sceneId})`
        );
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
      } else if (relation.type === "user_team") {
        const user = seedData.users.find((u) => u.id === relation.sourceId);
        const team = seedData.teams.find((t) => t.id === relation.targetId);

        if (user && team) {
          // データベースに保存されたIDを使用
          const dbUserId = users[user.name];
          const dbTeamId = teams[team.name];

          if (dbUserId && dbTeamId) {
            this.teamRepo.addUserToTeam(dbUserId, dbTeamId);
            console.log(`  ✅ Assigned ${user.name} to ${team.name}`);
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

    // チームをシード
    const teams: { [name: string]: string } = {};
    for (const teamData of seedData.teams) {
      const groupId = groups[teamData.groupName];

      const team = this.teamRepo.createTeam({
        name: teamData.name,
        groupId: groupId,
      });
      teams[teamData.name] = team.id;
      console.log(
        `  ✅ Created team: ${team.name} (group: ${teamData.groupName})`
      );
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
    for (const sportData of seedData.sports) {
      const sceneId = scenes[sportData.sceneName];

      if (sceneId) {
        const sport = this.sportRepo.createSport({
          name: sportData.name,
          sceneId: sceneId,
        });
        console.log(
          `  ✅ Created sport: ${sport.name} (scene: ${sportData.sceneName})`
        );
      } else {
        console.warn(
          `  ⚠️  Skipped sport: ${sportData.name} (scene not found: ${sportData.sceneName})`
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
    db.prepare("DELETE FROM user_teams").run();
    db.prepare("DELETE FROM user_groups").run();
    db.prepare("DELETE FROM teams").run();
    db.prepare("DELETE FROM users").run();
    db.prepare("DELETE FROM groups").run();
    db.prepare("DELETE FROM sports").run();
    db.prepare("DELETE FROM scenes").run();

    // Re-enable foreign key checks
    db.pragma("foreign_keys = ON");

    console.log("✅ Database cleared");
  }
}
