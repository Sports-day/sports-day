import { ulid } from "ulid";

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserInput {
  name: string;
  email: string;
}

export interface UpdateUserInput {
  name?: string;
  email?: string;
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

// In-memory data store
class UserStore {
  private users: Map<string, User> = new Map();
  private generatedCount: number = 0;

  // Initialize with some sample data
  constructor() {
    this.seedData();
  }

  private seedData(): void {
    // Generate 10 Japanese users
    JAPANESE_NAMES.forEach((name) => {
      this.createUser({
        name: name.japanese,
        email: `${name.roman}@fake.sports-day.net`,
      });
    });
  }

  // Get all users
  getAllUsers(): User[] {
    return Array.from(this.users.values());
  }

  // Get user by ID
  getUserById(id: string): User | undefined {
    return this.users.get(id);
  }

  // Get user by email
  getUserByEmail(email: string): User | undefined {
    return Array.from(this.users.values()).find((user) => user.email === email);
  }

  // Create new user
  createUser(input: CreateUserInput): User {
    // Check if email already exists
    if (this.getUserByEmail(input.email)) {
      throw new Error(`User with email ${input.email} already exists`);
    }

    const now = new Date().toISOString();
    const user: User = {
      id: ulid(),
      name: input.name,
      email: input.email,
      createdAt: now,
      updatedAt: now,
    };

    this.users.set(user.id, user);
    this.generatedCount++;
    return user;
  }

  // Update user
  updateUser(id: string, input: UpdateUserInput): User {
    const user = this.users.get(id);
    if (!user) {
      throw new Error(`User with id ${id} not found`);
    }

    // Check if email is being updated and if it already exists
    if (input.email && input.email !== user.email) {
      const existingUser = this.getUserByEmail(input.email);
      if (existingUser) {
        throw new Error(`User with email ${input.email} already exists`);
      }
    }

    const updatedUser: User = {
      ...user,
      ...input,
      updatedAt: new Date().toISOString(),
    };

    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Delete user
  deleteUser(id: string): boolean {
    return this.users.delete(id);
  }

  // Get generated count
  getGeneratedCount(): number {
    return this.generatedCount;
  }
}

// Export singleton instance
export const userStore = new UserStore();
