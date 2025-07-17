import Database from "better-sqlite3";
import { ulid } from "ulid";
import { User, CreateUserInput, UpdateUserInput } from "../models/User";

export class UserRepository {
  private db: Database.Database;

  constructor(db: Database.Database) {
    this.db = db;
  }

  findAll(): User[] {
    const stmt = this.db.prepare("SELECT * FROM users ORDER BY created_at");
    const rows = stmt.all() as any[];

    return rows.map((row) => ({
      id: row.id,
      name: row.name,
      email: row.email,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }));
  }

  findById(id: string): User | undefined {
    const stmt = this.db.prepare("SELECT * FROM users WHERE id = ?");
    const row = stmt.get(id) as any;

    if (!row) return undefined;

    return {
      id: row.id,
      name: row.name,
      email: row.email,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  findByEmail(email: string): User | undefined {
    const stmt = this.db.prepare("SELECT * FROM users WHERE email = ?");
    const row = stmt.get(email) as any;

    if (!row) return undefined;

    return {
      id: row.id,
      name: row.name,
      email: row.email,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  create(input: CreateUserInput): User {
    const now = new Date().toISOString();
    const id = ulid();

    const stmt = this.db.prepare(`
      INSERT INTO users (id, name, email, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?)
    `);

    stmt.run(id, input.name, input.email, now, now);

    return {
      id,
      name: input.name,
      email: input.email,
      createdAt: now,
      updatedAt: now,
    };
  }

  update(id: string, input: UpdateUserInput): User | undefined {
    const user = this.findById(id);
    if (!user) return undefined;

    const now = new Date().toISOString();
    const updates: string[] = [];
    const values: any[] = [];

    if (input.name !== undefined) {
      updates.push("name = ?");
      values.push(input.name);
    }

    if (input.email !== undefined) {
      updates.push("email = ?");
      values.push(input.email);
    }

    if (updates.length === 0) return user;

    updates.push("updated_at = ?");
    values.push(now);
    values.push(id);

    const stmt = this.db.prepare(`
      UPDATE users 
      SET ${updates.join(", ")}
      WHERE id = ?
    `);

    stmt.run(...values);

    return {
      ...user,
      ...input,
      updatedAt: now,
    };
  }

  delete(id: string): boolean {
    const stmt = this.db.prepare("DELETE FROM users WHERE id = ?");
    const result = stmt.run(id);
    return result.changes > 0;
  }

  count(): number {
    const stmt = this.db.prepare("SELECT COUNT(*) as count FROM users");
    const result = stmt.get() as any;
    return result.count;
  }
}
