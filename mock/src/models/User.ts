import { ulid } from "ulid";

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface CreateUserInput {
  name: string;
  email: string;
}

export interface UpdateUserInput {
  name?: string;
  email?: string;
}

// In-memory data store
class UserStore {
  private users: Map<string, User> = new Map();

  // Initialize with some sample data
  constructor() {
    this.seedData();
  }

  private seedData(): void {
    const sampleUsers: CreateUserInput[] = [
      { name: "John Doe", email: "john@example.com" },
      { name: "Jane Smith", email: "jane@example.com" },
      { name: "Bob Johnson", email: "bob@example.com" },
    ];

    sampleUsers.forEach((user) => {
      this.createUser(user);
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

    const user: User = {
      id: ulid(),
      name: input.name,
      email: input.email,
    };

    this.users.set(user.id, user);
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
    };

    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Delete user
  deleteUser(id: string): boolean {
    return this.users.delete(id);
  }
}

// Export singleton instance
export const userStore = new UserStore();
