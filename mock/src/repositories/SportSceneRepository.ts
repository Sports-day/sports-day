import Database from "better-sqlite3";
import { ulid } from "ulid";
import {
  SportScene,
  CreateSportSceneInput,
  UpdateSportSceneInput,
} from "../models/SportScene";

export class SportSceneRepository {
  private db: Database.Database;

  constructor(db: Database.Database) {
    this.db = db;
  }

  getAllSportScenes(): SportScene[] {
    const stmt = this.db.prepare(`
      SELECT id, sport_id, scene_id, created_at, updated_at
      FROM sport_scenes
      ORDER BY created_at DESC
    `);
    return stmt.all().map((row: any) => ({
      id: row.id,
      sportId: row.sport_id,
      sceneId: row.scene_id,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }));
  }

  getSportSceneById(id: string): SportScene | null {
    const stmt = this.db.prepare(`
      SELECT id, sport_id, scene_id, created_at, updated_at
      FROM sport_scenes
      WHERE id = ?
    `);
    const row = stmt.get(id) as any;
    if (!row) return null;

    return {
      id: row.id,
      sportId: row.sport_id,
      sceneId: row.scene_id,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  getSportScenesBySportId(sportId: string): SportScene[] {
    const stmt = this.db.prepare(`
      SELECT id, sport_id, scene_id, created_at, updated_at
      FROM sport_scenes
      WHERE sport_id = ?
      ORDER BY created_at DESC
    `);
    return stmt.all(sportId).map((row: any) => ({
      id: row.id,
      sportId: row.sport_id,
      sceneId: row.scene_id,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }));
  }

  getSportScenesBySceneId(sceneId: string): SportScene[] {
    const stmt = this.db.prepare(`
      SELECT id, sport_id, scene_id, created_at, updated_at
      FROM sport_scenes
      WHERE scene_id = ?
      ORDER BY created_at DESC
    `);
    return stmt.all(sceneId).map((row: any) => ({
      id: row.id,
      sportId: row.sport_id,
      sceneId: row.scene_id,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }));
  }

  createSportScene(input: CreateSportSceneInput): SportScene {
    const now = new Date().toISOString();
    const id = ulid();

    const stmt = this.db.prepare(`
      INSERT INTO sport_scenes (id, sport_id, scene_id, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?)
    `);

    stmt.run(id, input.sportId, input.sceneId, now, now);

    return {
      id,
      sportId: input.sportId,
      sceneId: input.sceneId,
      createdAt: now,
      updatedAt: now,
    };
  }

  updateSportScene(
    id: string,
    input: UpdateSportSceneInput
  ): SportScene | null {
    const now = new Date().toISOString();
    const current = this.getSportSceneById(id);
    if (!current) return null;

    const updates: string[] = [];
    const values: any[] = [];

    if (input.sportId !== undefined) {
      updates.push("sport_id = ?");
      values.push(input.sportId);
    }

    if (input.sceneId !== undefined) {
      updates.push("scene_id = ?");
      values.push(input.sceneId);
    }

    if (updates.length === 0) return current;

    updates.push("updated_at = ?");
    values.push(now);
    values.push(id);

    const stmt = this.db.prepare(`
      UPDATE sport_scenes
      SET ${updates.join(", ")}
      WHERE id = ?
    `);

    stmt.run(...values);

    return this.getSportSceneById(id);
  }

  deleteSportScene(id: string): boolean {
    const stmt = this.db.prepare("DELETE FROM sport_scenes WHERE id = ?");
    const result = stmt.run(id);
    return result.changes > 0;
  }
}
