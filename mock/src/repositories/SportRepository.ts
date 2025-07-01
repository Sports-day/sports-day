import Database from "better-sqlite3";
import { ulid } from "ulid";
import { Sport, CreateSportInput, UpdateSportInput } from "../models/Sport";

export class SportRepository {
  private db: Database.Database;

  constructor(db: Database.Database) {
    this.db = db;
  }

  getAllSports(): Sport[] {
    const stmt = this.db.prepare(`
      SELECT id, name, created_at, updated_at
      FROM sports
      ORDER BY created_at DESC
    `);
    return stmt.all().map((row: any) => ({
      id: row.id,
      name: row.name,
      scenes: [], // scenesは別途取得
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }));
  }

  getSportById(id: string): Sport | null {
    const stmt = this.db.prepare(`
      SELECT id, name, created_at, updated_at
      FROM sports
      WHERE id = ?
    `);
    const row = stmt.get(id) as any;
    if (!row) return null;

    return {
      id: row.id,
      name: row.name,
      scenes: [], // scenesは別途取得
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  createSport(input: CreateSportInput): Sport {
    const now = new Date().toISOString();
    const id = ulid();

    const stmt = this.db.prepare(`
      INSERT INTO sports (id, name, created_at, updated_at)
      VALUES (?, ?, ?, ?)
    `);

    stmt.run(id, input.name, now, now);

    return {
      id,
      name: input.name,
      scenes: [],
      createdAt: now,
      updatedAt: now,
    };
  }

  updateSport(id: string, input: UpdateSportInput): Sport | null {
    const existing = this.getSportById(id);
    if (!existing) return null;

    const now = new Date().toISOString();
    const updates: string[] = [];
    const values: any[] = [];

    if (input.name !== undefined) {
      updates.push("name = ?");
      values.push(input.name);
    }

    if (updates.length === 0) return existing;

    updates.push("updated_at = ?");
    values.push(now);
    values.push(id);

    const stmt = this.db.prepare(`
      UPDATE sports
      SET ${updates.join(", ")}
      WHERE id = ?
    `);

    stmt.run(...values);

    return {
      ...existing,
      name: input.name ?? existing.name,
      updatedAt: now,
    };
  }

  deleteSport(id: string): boolean {
    const stmt = this.db.prepare("DELETE FROM sports WHERE id = ?");
    const result = stmt.run(id);
    return result.changes > 0;
  }
}
