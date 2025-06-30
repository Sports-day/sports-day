import { ulid } from "ulid";

// エンティティ定義
interface SeedEntity {
  id: string;
  name: string;
}

// ユーザー定義
interface SeedUser extends SeedEntity {
  email: string;
}

// グループ定義
interface SeedGroup extends SeedEntity {
  type: "team" | "project" | "department";
  description: string;
}

// シーン定義
interface SeedScene extends SeedEntity {
  description?: string;
}

// スポーツ定義
interface SeedSport extends SeedEntity {
  // sceneIdは削除（SportSceneで管理）
}

// リレーション定義
interface SeedRelation {
  type: "user_group" | "sport_scene";
  sourceId: string;
  targetId: string;
  metadata?: Record<string, any>;
}

// シードデータ定義
export interface SeedData {
  users: SeedUser[];
  groups: SeedGroup[];
  scenes: SeedScene[];
  sports: SeedSport[];
  relations: SeedRelation[];
}

// シードデータファクトリー
export class SeedDataFactory {
  private entities: Map<string, SeedEntity> = new Map();
  private relations: SeedRelation[] = [];

  // エンティティを登録
  registerEntity(entity: SeedEntity): string {
    this.entities.set(entity.name, entity);
    return entity.id;
  }

  // リレーションを追加
  addRelation(
    type: string,
    sourceName: string,
    targetName: string,
    metadata?: Record<string, any>
  ): void {
    const source = this.entities.get(sourceName);
    const target = this.entities.get(targetName);

    if (!source || !target) {
      throw new Error(`Entity not found: ${sourceName} or ${targetName}`);
    }

    this.relations.push({
      type: type as any,
      sourceId: source.id,
      targetId: target.id,
      metadata,
    });
  }

  // シードデータを生成
  generate(): SeedData {
    const users = Array.from(this.entities.values()).filter(
      (e) => "email" in e
    ) as SeedUser[];
    const groups = Array.from(this.entities.values()).filter(
      (e) => "type" in e && !("email" in e) && !("groupId" in e)
    ) as SeedGroup[];

    // シーンは description を持つもののみ
    const scenes = Array.from(this.entities.values()).filter(
      (e) =>
        !("email" in e) &&
        !("type" in e) &&
        !("groupId" in e) &&
        "description" in e
    ) as SeedScene[];

    // スポーツは description を持たないもののみ
    const sports = Array.from(this.entities.values()).filter(
      (e) =>
        !("email" in e) &&
        !("type" in e) &&
        !("groupId" in e) &&
        !("description" in e)
    ) as SeedSport[];

    return {
      users,
      groups,
      scenes,
      sports,
      relations: this.relations,
    };
  }
}

// CSVファイルから取得した100人のユーザーデータ
const CSV_USERS = [
  { name: "近藤 陸", email: "riku.kondo@fake.sports-day.net" },
  { name: "渡辺 蓮司", email: "renji.watanabe@fake.sports-day.net" },
  { name: "小野 七海", email: "nanami.ono@fake.sports-day.net" },
  { name: "中村 武", email: "takeru.nakamura@fake.sports-day.net" },
  { name: "山口 葵", email: "aoi.yamaguchi@fake.sports-day.net" },
  { name: "森 葵", email: "aoi.mori@fake.sports-day.net" },
  { name: "森 健", email: "ken.mori@fake.sports-day.net" },
  { name: "山口 雪", email: "yuki.yamaguchi@fake.sports-day.net" },
  { name: "金子 陸", email: "riku.kaneko@fake.sports-day.net" },
  { name: "伊藤 紗耶香", email: "sayaka.ito@fake.sports-day.net" },
  { name: "村上 智", email: "tomo.murakami@fake.sports-day.net" },
  { name: "井上 夢", email: "yume.inoue@fake.sports-day.net" },
  { name: "佐藤 紗耶香", email: "sayaka.sato@fake.sports-day.net" },
  { name: "井上 次郎", email: "jiro.inoue@fake.sports-day.net" },
  { name: "小川 恵美", email: "emi.ogawa@fake.sports-day.net" },
  { name: "武田 桜", email: "sakura.takeda@fake.sports-day.net" },
  { name: "清水 未来", email: "miku.shimizu@fake.sports-day.net" },
  { name: "野口 怜", email: "rei.noguchi@fake.sports-day.net" },
  { name: "武田 壮太", email: "souta.takeda@fake.sports-day.net" },
  { name: "林 莉子", email: "riko.hayashi@fake.sports-day.net" },
  { name: "村上 壮太", email: "souta.murakami@fake.sports-day.net" },
  { name: "太田 蓮", email: "ren.ota@fake.sports-day.net" },
  { name: "菊池 太郎", email: "taro.kikuchi@fake.sports-day.net" },
  { name: "田村 美優", email: "miyu.tamura@fake.sports-day.net" },
  { name: "村上 壮介", email: "sosuke.murakami@fake.sports-day.net" },
  { name: "長谷川 直樹", email: "naoki.hasegawa@fake.sports-day.net" },
  { name: "黒田 結愛", email: "yua.kuroda@fake.sports-day.net" },
  { name: "長谷川 里奈", email: "rina.hasegawa@fake.sports-day.net" },
  { name: "小野 翼", email: "tsubasa.ono@fake.sports-day.net" },
  { name: "林 翔", email: "sho.hayashi@fake.sports-day.net" },
  { name: "平野 智", email: "tomo.hirano@fake.sports-day.net" },
  { name: "金子 涼太", email: "ryota.kaneko@fake.sports-day.net" },
  { name: "松田 匠", email: "takumi.matsuda@fake.sports-day.net" },
  { name: "伊藤 愛莉", email: "airi.ito@fake.sports-day.net" },
  { name: "松本 陽翔", email: "haruto.matsumoto@fake.sports-day.net" },
  { name: "黒田 蓮", email: "ren.kuroda@fake.sports-day.net" },
  { name: "小川 直樹", email: "naoki.ogawa@fake.sports-day.net" },
  { name: "石川 健太", email: "kenta.ishikawa@fake.sports-day.net" },
  { name: "田村 大輝", email: "daiki.tamura@fake.sports-day.net" },
  { name: "藤田 俊", email: "shun.fujita@fake.sports-day.net" },
  { name: "佐々木 里奈", email: "rina.sasaki@fake.sports-day.net" },
  { name: "佐藤 桜", email: "sakura.sato@fake.sports-day.net" },
  { name: "菊池 小春", email: "koharu.kikuchi@fake.sports-day.net" },
  { name: "黒田 塁", email: "rui.kuroda@fake.sports-day.net" },
  { name: "安藤 壮太", email: "souta.ando@fake.sports-day.net" },
  { name: "鈴木 美咲", email: "misaki.suzuki@fake.sports-day.net" },
  { name: "安藤 紗耶香", email: "sayaka.ando@fake.sports-day.net" },
  { name: "近藤 武", email: "takeru.kondo@fake.sports-day.net" },
  { name: "森 蓮司", email: "renji.mori@fake.sports-day.net" },
  { name: "加藤 怜", email: "rei.kato@fake.sports-day.net" },
  { name: "藤田 翔太", email: "shota.fujita@fake.sports-day.net" },
  { name: "高橋 恵美", email: "emi.takahashi@fake.sports-day.net" },
  { name: "太田 七海", email: "nanami.ota@fake.sports-day.net" },
  { name: "田村 陽子", email: "hinako.tamura@fake.sports-day.net" },
  { name: "松田 里奈", email: "rina.matsuda@fake.sports-day.net" },
  { name: "松本 頼", email: "yori.matsumoto@fake.sports-day.net" },
  { name: "平野 里奈", email: "rina.hirano@fake.sports-day.net" },
  { name: "新井 雪", email: "yuki.arai@fake.sports-day.net" },
  { name: "平野 結愛", email: "yua.hirano@fake.sports-day.net" },
  { name: "山口 次郎", email: "jiro.yamaguchi@fake.sports-day.net" },
  { name: "小川 星奈", email: "sena.ogawa@fake.sports-day.net" },
  { name: "佐々木 俊", email: "shun.sasaki@fake.sports-day.net" },
  { name: "阿部 紗耶香", email: "sayaka.abe@fake.sports-day.net" },
  { name: "福田 桜", email: "sakura.fukuda@fake.sports-day.net" },
  { name: "村上 健太", email: "kenta.murakami@fake.sports-day.net" },
  { name: "松田 結愛", email: "yua.matsuda@fake.sports-day.net" },
  { name: "黒田 健", email: "ken.kuroda@fake.sports-day.net" },
  { name: "福田 頼", email: "yori.fukuda@fake.sports-day.net" },
  { name: "金子 結愛", email: "yua.kaneko@fake.sports-day.net" },
  { name: "黒田 小春", email: "koharu.kuroda@fake.sports-day.net" },
  { name: "井上 涼太", email: "ryota.inoue@fake.sports-day.net" },
  { name: "高橋 塁", email: "rui.takahashi@fake.sports-day.net" },
  { name: "藤本 結愛", email: "yua.fujimoto@fake.sports-day.net" },
  { name: "佐々木 怜", email: "rei.sasaki@fake.sports-day.net" },
  { name: "松本 俊", email: "shun.matsumoto@fake.sports-day.net" },
  { name: "佐々木 健", email: "ken.sasaki@fake.sports-day.net" },
  { name: "石川 彩", email: "aya.ishikawa@fake.sports-day.net" },
  { name: "安藤 雪", email: "yuki.ando@fake.sports-day.net" },
  { name: "村上 直樹", email: "naoki.murakami@fake.sports-day.net" },
  { name: "鈴木 優翔", email: "yuto.suzuki@fake.sports-day.net" },
  { name: "福田 海翔", email: "kaito.fukuda@fake.sports-day.net" },
  { name: "井上 蓮司", email: "renji.inoue@fake.sports-day.net" },
  { name: "石川 未来", email: "miku.ishikawa@fake.sports-day.net" },
  { name: "太田 花子", email: "hanako.ota@fake.sports-day.net" },
  { name: "福田 葵", email: "aoi.fukuda@fake.sports-day.net" },
  { name: "山本 翔太", email: "shota.yamamoto@fake.sports-day.net" },
  { name: "安藤 翔", email: "sho.ando@fake.sports-day.net" },
  { name: "山田 匠", email: "takumi.yamada@fake.sports-day.net" },
  { name: "宮崎 大輝", email: "daiki.miyazaki@fake.sports-day.net" },
  { name: "石川 七海", email: "nanami.ishikawa@fake.sports-day.net" },
  { name: "佐藤 翔", email: "sho.sato@fake.sports-day.net" },
  { name: "渡辺 健", email: "ken.watanabe@fake.sports-day.net" },
  { name: "藤本 慶太", email: "keita.fujimoto@fake.sports-day.net" },
  { name: "後藤 愛莉", email: "airi.goto@fake.sports-day.net" },
  { name: "小野 雪", email: "yuki.ono@fake.sports-day.net" },
  { name: "安藤 彩", email: "aya.ando@fake.sports-day.net" },
  { name: "村上 陽菜", email: "hina.murakami@fake.sports-day.net" },
  { name: "高木 直樹", email: "naoki.takagi@fake.sports-day.net" },
  { name: "新井 太郎", email: "taro.arai@fake.sports-day.net" },
  { name: "森 美咲", email: "misaki.mori@fake.sports-day.net" },
];

// 100人を1グループ50人ずつに分ける関数
const createUserGroupAssignments = () => {
  const assignments = [];

  // 最初の50人をサクラに割り当て
  for (let i = 0; i < 50; i++) {
    assignments.push({
      userName: CSV_USERS[i].name,
      groupName: "サクラ",
    });
  }

  // 残りの50人をアサヒに割り当て
  for (let i = 50; i < 100; i++) {
    assignments.push({
      userName: CSV_USERS[i].name,
      groupName: "アサヒ",
    });
  }

  return assignments;
};

// Japanese names mapping
interface JapaneseName {
  japanese: string;
  roman: string;
}

// Sample groups
const SAMPLE_GROUPS = [{ name: "サクラ" }, { name: "アサヒ" }];

// Sample scenes (晴天時と雨天時のみ)
const SAMPLE_SCENES = [
  {
    name: "晴天時",
    description: "晴れた日の屋外スポーツイベント",
  },
  {
    name: "雨天時",
    description: "雨の日の屋内スポーツイベント",
  },
];

// Sample sports (新しい要件に合わせて更新)
const SAMPLE_SPORTS = [
  { name: "バスケットボール" },
  { name: "バレーボール" },
  { name: "ビーチボール" },
  { name: "バドミントン" },
  { name: "フットサル" },
  { name: "ストラックアウト" },
];

// Sample sport-scene relationships (新しい要件に合わせて更新)
const SAMPLE_SPORT_SCENE_RELATIONS = [
  { sportName: "バスケットボール", sceneName: "晴天時" },
  { sportName: "バスケットボール", sceneName: "雨天時" },
  { sportName: "バレーボール", sceneName: "雨天時" },
  { sportName: "ビーチボール", sceneName: "晴天時" },
  { sportName: "ビーチボール", sceneName: "雨天時" },
  { sportName: "バドミントン", sceneName: "雨天時" },
  { sportName: "フットサル", sceneName: "晴天時" },
  { sportName: "ストラックアウト", sceneName: "晴天時" },
];

// User-Group assignments (100人を1グループ50人ずつに分ける)
const USER_GROUP_ASSIGNMENTS = createUserGroupAssignments();

// 後方互換性のためのインターフェース
export interface LegacySeedUser {
  name: string;
  email: string;
}

export interface LegacySeedGroup {
  name: string;
}

export interface LegacySeedScene {
  name: string;
  description?: string;
}

export interface LegacySeedSport {
  name: string;
  sceneName: string;
}

export interface LegacySeedUserGroupAssignment {
  userName: string;
  groupName: string;
}

// 現在のシードデータ（後方互換性のため）
export const seedData = {
  users: CSV_USERS.map(
    (user): LegacySeedUser => ({
      name: user.name,
      email: user.email,
    })
  ),
  groups: SAMPLE_GROUPS.map(
    (group): LegacySeedGroup => ({
      name: group.name,
    })
  ),
  scenes: SAMPLE_SCENES.map(
    (scene): LegacySeedScene => ({
      name: scene.name,
      description: scene.description,
    })
  ),
  sports: SAMPLE_SPORTS.map(
    (sport): LegacySeedSport => ({
      name: sport.name,
      sceneName: sport.name,
    })
  ),
  userGroupAssignments: USER_GROUP_ASSIGNMENTS,
};

// 複雑なシードデータ作成例（メタデータ付きリレーション）
export const createComplexSeedData = (): SeedData => {
  const factory = new SeedDataFactory();

  // CSVファイルの100人のユーザーを登録
  CSV_USERS.forEach((user) => {
    factory.registerEntity({
      id: ulid(),
      name: user.name,
      email: user.email,
    } as SeedUser);
  });

  // グループを登録
  factory.registerEntity({
    id: ulid(),
    name: "サクラ",
    type: "team",
    description: "開発チームA",
  } as SeedGroup);

  factory.registerEntity({
    id: ulid(),
    name: "アサヒ",
    type: "team",
    description: "開発チームB",
  } as SeedGroup);

  // ユーザーグループ割り当て（CSVデータを使用）
  const userGroupAssignments = createUserGroupAssignments();
  userGroupAssignments.forEach((assignment) => {
    factory.addRelation(
      "user_group",
      assignment.userName,
      assignment.groupName,
      {
        role: "member",
        joinedAt: "2024-01-01",
      }
    );
  });

  // シーン登録
  SAMPLE_SCENES.forEach((scene) => {
    factory.registerEntity({
      id: ulid(),
      name: scene.name,
      description: scene.description,
    } as SeedScene);
  });

  // スポーツ登録
  SAMPLE_SPORTS.forEach((sport) => {
    factory.registerEntity({
      id: ulid(),
      name: sport.name,
    } as SeedSport);
  });

  // SportSceneリレーションを追加
  SAMPLE_SPORT_SCENE_RELATIONS.forEach((relation) => {
    factory.addRelation("sport_scene", relation.sportName, relation.sceneName);
  });

  return factory.generate();
};

// シンプルなシードデータ（CSVファイルの100人を使用）
export const createSimpleSeedData = (): SeedData => {
  const factory = new SeedDataFactory();

  // CSVファイルの100人のユーザーを登録
  CSV_USERS.forEach((user) => {
    factory.registerEntity({
      id: ulid(),
      name: user.name,
      email: user.email,
    } as SeedUser);
  });

  // グループ登録
  const groups = [
    { name: "サクラ", type: "team" as const, description: "チームA" },
    { name: "アサヒ", type: "team" as const, description: "チームB" },
  ];

  groups.forEach((group) => {
    factory.registerEntity({
      id: ulid(),
      name: group.name,
      type: group.type,
      description: group.description,
    } as SeedGroup);
  });

  // リレーション追加（最初の50人をサクラ、次の50人をアサヒに）
  const sakuraUsers = CSV_USERS.slice(0, 50);
  const asahiUsers = CSV_USERS.slice(50, 100);

  sakuraUsers.forEach((user) => {
    factory.addRelation("user_group", user.name, "サクラ");
  });

  asahiUsers.forEach((user) => {
    factory.addRelation("user_group", user.name, "アサヒ");
  });

  // シーン登録
  SAMPLE_SCENES.forEach((scene) => {
    factory.registerEntity({
      id: ulid(),
      name: scene.name,
      description: scene.description,
    } as SeedScene);
  });

  // スポーツ登録
  SAMPLE_SPORTS.forEach((sport) => {
    factory.registerEntity({
      id: ulid(),
      name: sport.name,
    } as SeedSport);
  });

  // SportSceneリレーションを追加
  SAMPLE_SPORT_SCENE_RELATIONS.forEach((relation) => {
    factory.addRelation("sport_scene", relation.sportName, relation.sceneName);
  });

  return factory.generate();
};

// 新しいファクトリーベースのシードデータ
export const createSeedData = () => {
  return createSimpleSeedData();
};

// 後方互換性のための関数
export const generateSeedData = () => {
  const now = new Date().toISOString();

  const users = seedData.users.map((user) => ({
    id: ulid(),
    ...user,
    createdAt: now,
    updatedAt: now,
  }));

  const groups = seedData.groups.map((group) => ({
    id: ulid(),
    ...group,
    userIds: new Set<string>(),
    createdAt: now,
    updatedAt: now,
  }));

  const scenes = seedData.scenes.map((scene) => ({
    id: ulid(),
    ...scene,
    createdAt: now,
    updatedAt: now,
  }));

  const sports = seedData.sports.map((sport) => ({
    id: ulid(),
    ...sport,
    createdAt: now,
    updatedAt: now,
  }));

  return { users, groups, scenes, sports };
};
