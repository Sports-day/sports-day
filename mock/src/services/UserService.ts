import { User, CreateUserInput, UpdateUserInput } from "../models/User";
import { UserRepository } from "../repositories/UserRepository";

export class UserService {
  private userRepo: UserRepository;

  constructor(userRepo: UserRepository) {
    this.userRepo = userRepo;
  }

  getAllUsers(): User[] {
    return this.userRepo.findAll();
  }

  getUserById(id: string): User | undefined {
    return this.userRepo.findById(id);
  }

  getUserByEmail(email: string): User | undefined {
    return this.userRepo.findByEmail(email);
  }

  createUser(input: CreateUserInput): User {
    // Check if email already exists
    const existingUser = this.userRepo.findByEmail(input.email);
    if (existingUser) {
      throw new Error(`User with email ${input.email} already exists`);
    }

    return this.userRepo.create(input);
  }

  updateUser(id: string, input: UpdateUserInput): User {
    // Check if user exists
    const existingUser = this.userRepo.findById(id);
    if (!existingUser) {
      throw new Error(`User with id ${id} not found`);
    }

    // Check if email is being updated and if it already exists
    if (input.email && input.email !== existingUser.email) {
      const userWithEmail = this.userRepo.findByEmail(input.email);
      if (userWithEmail) {
        throw new Error(`User with email ${input.email} already exists`);
      }
    }

    const updatedUser = this.userRepo.update(id, input);
    if (!updatedUser) {
      throw new Error(`Failed to update user with id ${id}`);
    }

    return updatedUser;
  }

  deleteUser(id: string): boolean {
    // Check if user exists
    const existingUser = this.userRepo.findById(id);
    if (!existingUser) {
      throw new Error(`User with id ${id} not found`);
    }

    return this.userRepo.delete(id);
  }

  getGeneratedCount(): number {
    return this.userRepo.count();
  }
}
