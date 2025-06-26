import Database from "better-sqlite3";
import { ulid } from "ulid";
import { Group, CreateGroupInput, UpdateGroupInput } from "../models/Group";

export class GroupRepository {
  private db: Database.Database;

  constructor(db: Database.Database) {
    this.db = db;
  }

  findAll(): Group[] {
    const stmt = this.db.prepare("SELECT * FROM groups ORDER BY created_at");
    const rows = stmt.all() as any[];

    return rows.map((row) => ({
      id: row.id,
      name: row.name,
      userIds: new Set<string>(),
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }));
  }

  findById(id: string): Group | undefined {
    const stmt = this.db.prepare("SELECT * FROM groups WHERE id = ?");
    const row = stmt.get(id) as any;

    if (!row) return undefined;

    return {
      id: row.id,
      name: row.name,
      userIds: new Set<string>(),
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  create(input: CreateGroupInput): Group {
    const now = new Date().toISOString();
    const id = ulid();

    const stmt = this.db.prepare(`
      INSERT INTO groups (id, name, created_at, updated_at)
      VALUES (?, ?, ?, ?)
    `);

    stmt.run(id, input.name, now, now);

    return {
      id,
      name: input.name,
      userIds: new Set<string>(),
      createdAt: now,
      updatedAt: now,
    };
  }

  update(id: string, input: UpdateGroupInput): Group | undefined {
    const group = this.findById(id);
    if (!group) return undefined;

    const now = new Date().toISOString();
    const updates: string[] = [];
    const values: any[] = [];

    if (input.name !== undefined) {
      updates.push("name = ?");
      values.push(input.name);
    }

    if (updates.length === 0) return group;

    updates.push("updated_at = ?");
    values.push(now);
    values.push(id);

    const stmt = this.db.prepare(`
      UPDATE groups 
      SET ${updates.join(", ")}
      WHERE id = ?
    `);

    stmt.run(...values);

    return {
      ...group,
      ...input,
      updatedAt: now,
    };
  }

  delete(id: string): boolean {
    const stmt = this.db.prepare("DELETE FROM groups WHERE id = ?");
    const result = stmt.run(id);
    return result.changes > 0;
  }

  // User-Group relationship methods
  addUserToGroup(userId: string, groupId: string): boolean {
    const now = new Date().toISOString();

    const stmt = this.db.prepare(`
      INSERT OR IGNORE INTO user_groups (user_id, group_id, created_at)
      VALUES (?, ?, ?)
    `);

    const result = stmt.run(userId, groupId, now);
    return result.changes > 0;
  }

  removeUserFromGroup(userId: string, groupId: string): boolean {
    const stmt = this.db.prepare(`
      DELETE FROM user_groups 
      WHERE user_id = ? AND group_id = ?
    `);

    const result = stmt.run(userId, groupId);
    return result.changes > 0;
  }

  getGroupsByUserId(userId: string): Group[] {
    const stmt = this.db.prepare(`
      SELECT g.* FROM groups g
      INNER JOIN user_groups ug ON g.id = ug.group_id
      WHERE ug.user_id = ?
      ORDER BY g.created_at
    `);

    const rows = stmt.all(userId) as any[];

    return rows.map((row) => ({
      id: row.id,
      name: row.name,
      userIds: new Set<string>(),
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }));
  }

  getUserIdsByGroupId(groupId: string): string[] {
    const stmt = this.db.prepare(`
      SELECT user_id FROM user_groups
      WHERE group_id = ?
      ORDER BY created_at
    `);

    const rows = stmt.all(groupId) as any[];
    return rows.map((row) => row.user_id);
  }

  getGroupWithUsers(groupId: string): Group | undefined {
    const group = this.findById(groupId);
    if (!group) return undefined;

    const userIds = this.getUserIdsByGroupId(groupId);
    return {
      ...group,
      userIds: new Set(userIds),
    };
  }

  count(): number {
    const stmt = this.db.prepare("SELECT COUNT(*) as count FROM groups");
    const result = stmt.get() as any;
    return result.count;
  }
}
