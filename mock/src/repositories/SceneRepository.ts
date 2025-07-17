import Database from "better-sqlite3";
import { ulid } from "ulid";
import { Scene, CreateSceneInput, UpdateSceneInput } from "../models/Scene";

export class SceneRepository {
  private db: Database.Database;

  constructor(db: Database.Database) {
    this.db = db;
  }

  getAllScenes(): Scene[] {
    const stmt = this.db.prepare(`
      SELECT id, name, description, created_at, updated_at
      FROM scenes
      ORDER BY created_at DESC
    `);

    return stmt.all().map((row: any) => ({
      id: row.id,
      name: row.name,
      description: row.description,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }));
  }

  getSceneById(id: string): Scene | null {
    const stmt = this.db.prepare(`
      SELECT id, name, description, created_at, updated_at
      FROM scenes
      WHERE id = ?
    `);

    const row = stmt.get(id) as any;
    if (!row) return null;

    return {
      id: row.id,
      name: row.name,
      description: row.description,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  createScene(input: CreateSceneInput): Scene {
    const id = ulid();
    const now = new Date().toISOString();

    const stmt = this.db.prepare(`
      INSERT INTO scenes (id, name, description, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?)
    `);

    stmt.run(id, input.name, input.description || null, now, now);

    return {
      id,
      name: input.name,
      description: input.description,
      createdAt: now,
      updatedAt: now,
    };
  }

  updateScene(id: string, input: UpdateSceneInput): Scene | null {
    const existingScene = this.getSceneById(id);
    if (!existingScene) return null;

    const now = new Date().toISOString();
    const name = input.name ?? existingScene.name;
    const description =
      input.description !== undefined
        ? input.description
        : existingScene.description;

    const stmt = this.db.prepare(`
      UPDATE scenes
      SET name = ?, description = ?, updated_at = ?
      WHERE id = ?
    `);

    stmt.run(name, description, now, id);

    return {
      id,
      name,
      description,
      createdAt: existingScene.createdAt,
      updatedAt: now,
    };
  }

  deleteScene(id: string): boolean {
    const stmt = this.db.prepare("DELETE FROM scenes WHERE id = ?");
    const result = stmt.run(id);
    return result.changes > 0;
  }
}
