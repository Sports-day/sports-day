import { ulid } from "ulid";

// エンティティ定義
interface SeedEntity {
  id: string;
  name: string;
}

// ユーザー定義
interface SeedUser extends SeedEntity {
  email: string;
  role: "admin" | "user";
  department: string;
}

// グループ定義
interface SeedGroup extends SeedEntity {
  type: "team" | "project" | "department";
  description: string;
}

// チーム定義
interface SeedTeam extends SeedEntity {
  groupId?: string;
  description: string;
}

// シーン定義
interface SeedScene extends SeedEntity {
  description?: string;
}

// リレーション定義
interface SeedRelation {
  type: "user_group" | "user_team";
  sourceId: string;
  targetId: string;
  metadata?: Record<string, any>;
}

// シードデータ定義
export interface SeedData {
  users: SeedUser[];
  groups: SeedGroup[];
  teams: SeedTeam[];
  scenes: SeedScene[];
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
    const teams = Array.from(this.entities.values()).filter(
      (e) => "groupId" in e
    ) as SeedTeam[];
    const scenes = Array.from(this.entities.values()).filter(
      (e) => !("email" in e) && !("type" in e) && !("groupId" in e)
    ) as SeedScene[];

    return {
      users,
      groups,
      teams,
      scenes,
      relations: this.relations,
    };
  }
}

// Japanese names mapping
interface JapaneseName {
  japanese: string;
  roman: string;
}

const JAPANESE_NAMES: JapaneseName[] = [
  { japanese: "田中太郎", roman: "tanaka_taro" },
  { japanese: "佐藤花子", roman: "sato_hanako" },
  { japanese: "鈴木一郎", roman: "suzuki_ichiro" },
  { japanese: "高橋美咲", roman: "takahashi_misaki" },
  { japanese: "渡辺健太", roman: "watanabe_kenta" },
  { japanese: "伊藤愛", roman: "ito_ai" },
  { japanese: "山田次郎", roman: "yamada_jiro" },
  { japanese: "中村由美", roman: "nakamura_yumi" },
  { japanese: "小林翔太", roman: "kobayashi_shota" },
  { japanese: "加藤麻衣", roman: "kato_mai" },
];

// Sample groups
const SAMPLE_GROUPS = [{ name: "サクラ" }, { name: "アサヒ" }];

// Sample teams
const SAMPLE_TEAMS = [
  {
    name: "フロントエンドチーム",
    groupName: "サクラ",
    description: "React/TypeScript開発チーム",
  },
  {
    name: "バックエンドチーム",
    groupName: "サクラ",
    description: "Go/GraphQL開発チーム",
  },
  {
    name: "デザインチーム",
    groupName: "アサヒ",
    description: "UI/UXデザインチーム",
  },
  { name: "QAチーム", groupName: "アサヒ", description: "品質保証チーム" },
];

// Sample scenes
const SAMPLE_SCENES = [
  {
    name: "晴天時",
    description: "晴れた日の屋外スポーツイベント",
  },
  {
    name: "雨天時",
    description: "雨の日の屋内スポーツイベント",
  },
  {
    name: "曇天時",
    description: "曇りの日の屋外スポーツイベント",
  },
  {
    name: "夜間",
    description: "夜間のスポーツイベント",
  },
];

// User-Group assignments (first 5 users to サクラ, next 5 to アサヒ)
const USER_GROUP_ASSIGNMENTS = [
  { userName: "田中太郎", groupName: "サクラ" },
  { userName: "佐藤花子", groupName: "サクラ" },
  { userName: "鈴木一郎", groupName: "サクラ" },
  { userName: "高橋美咲", groupName: "サクラ" },
  { userName: "渡辺健太", groupName: "サクラ" },
  { userName: "伊藤愛", groupName: "アサヒ" },
  { userName: "山田次郎", groupName: "アサヒ" },
  { userName: "中村由美", groupName: "アサヒ" },
  { userName: "小林翔太", groupName: "アサヒ" },
  { userName: "加藤麻衣", groupName: "アサヒ" },
];

// 後方互換性のためのインターフェース
export interface LegacySeedUser {
  name: string;
  email: string;
}

export interface LegacySeedGroup {
  name: string;
}

export interface LegacySeedTeam {
  name: string;
  groupName: string;
  description: string;
}

export interface LegacySeedScene {
  name: string;
  description?: string;
}

export interface LegacySeedUserGroupAssignment {
  userName: string;
  groupName: string;
}

export interface LegacySeedUserTeamAssignment {
  userName: string;
  teamName: string;
}

// 現在のシードデータ（後方互換性のため）
export const seedData = {
  users: JAPANESE_NAMES.map(
    (name): LegacySeedUser => ({
      name: name.japanese,
      email: `${name.roman}@fake.sports-day.net`,
    })
  ),
  groups: SAMPLE_GROUPS.map(
    (group): LegacySeedGroup => ({
      name: group.name,
    })
  ),
  teams: SAMPLE_TEAMS.map(
    (team): LegacySeedTeam => ({
      name: team.name,
      groupName: team.groupName,
      description: team.description,
    })
  ),
  scenes: SAMPLE_SCENES.map(
    (scene): LegacySeedScene => ({
      name: scene.name,
      description: scene.description,
    })
  ),
  userGroupAssignments: USER_GROUP_ASSIGNMENTS,
};

// 複雑なシードデータ作成例（メタデータ付きリレーション）
export const createComplexSeedData = (): SeedData => {
  const factory = new SeedDataFactory();

  // ユーザーを登録
  factory.registerEntity({
    id: ulid(),
    name: "田中太郎",
    email: "tanaka_taro@fake.sports-day.net",
    role: "admin",
    department: "開発部",
  } as SeedUser);

  factory.registerEntity({
    id: ulid(),
    name: "佐藤花子",
    email: "sato_hanako@fake.sports-day.net",
    role: "user",
    department: "営業部",
  } as SeedUser);

  factory.registerEntity({
    id: ulid(),
    name: "鈴木一郎",
    email: "suzuki_ichiro@fake.sports-day.net",
    role: "user",
    department: "開発部",
  } as SeedUser);

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

  // チームを登録
  factory.registerEntity({
    id: ulid(),
    name: "フロントエンドチーム",
    groupId: "サクラ", // グループ名で参照
    description: "React/TypeScript開発チーム",
  } as SeedTeam);

  factory.registerEntity({
    id: ulid(),
    name: "バックエンドチーム",
    groupId: "サクラ", // グループ名で参照
    description: "Go/GraphQL開発チーム",
  } as SeedTeam);

  // リレーションを追加（メタデータ付き）
  factory.addRelation("user_group", "田中太郎", "サクラ", {
    role: "leader",
    joinedAt: "2024-01-01",
  });
  factory.addRelation("user_group", "佐藤花子", "アサヒ", {
    role: "member",
    joinedAt: "2024-02-01",
  });
  factory.addRelation("user_group", "鈴木一郎", "サクラ", {
    role: "member",
    joinedAt: "2024-01-15",
  });

  // チームリレーションを追加
  factory.addRelation("user_team", "田中太郎", "フロントエンドチーム", {
    role: "leader",
    joinedAt: "2024-01-01",
  });
  factory.addRelation("user_team", "鈴木一郎", "バックエンドチーム", {
    role: "member",
    joinedAt: "2024-01-15",
  });

  // シーン登録
  SAMPLE_SCENES.forEach((scene) => {
    factory.registerEntity({
      id: ulid(),
      name: scene.name,
      description: scene.description,
    } as SeedScene);
  });

  return factory.generate();
};

// シンプルなシードデータ（現在の方式の改善版）
export const createSimpleSeedData = (): SeedData => {
  const factory = new SeedDataFactory();

  // ユーザー登録
  const users = [
    { name: "田中太郎", email: "tanaka_taro@fake.sports-day.net" },
    { name: "佐藤花子", email: "sato_hanako@fake.sports-day.net" },
    { name: "鈴木一郎", email: "suzuki_ichiro@fake.sports-day.net" },
    { name: "高橋美咲", email: "takahashi_misaki@fake.sports-day.net" },
    { name: "渡辺健太", email: "watanabe_kenta@fake.sports-day.net" },
    { name: "伊藤愛", email: "ito_ai@fake.sports-day.net" },
    { name: "山田次郎", email: "yamada_jiro@fake.sports-day.net" },
    { name: "中村由美", email: "nakamura_yumi@fake.sports-day.net" },
    { name: "小林翔太", email: "kobayashi_shota@fake.sports-day.net" },
    { name: "加藤麻衣", email: "kato_mai@fake.sports-day.net" },
  ];

  users.forEach((user) => {
    factory.registerEntity({
      id: ulid(),
      name: user.name,
      email: user.email,
      role: "user",
      department: "一般",
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

  // リレーション追加（最初の5人をサクラ、次の5人をアサヒに）
  const sakuraUsers = users.slice(0, 5);
  const asahiUsers = users.slice(5, 10);

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

  const teams = seedData.teams.map((team) => ({
    id: ulid(),
    name: team.name,
    groupId: undefined, // 後でグループIDに変換
    description: team.description,
    userIds: new Set<string>(),
    createdAt: now,
    updatedAt: now,
  }));

  return { users, groups, teams };
};
