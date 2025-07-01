import Database from "better-sqlite3";
import { ulid } from "ulid";
import {
  SportEntry,
  CreateSportEntryInput,
  UpdateSportEntryInput,
} from "../models/SportEntry";

export class SportEntryRepository {
  private db: Database.Database;

  constructor(db: Database.Database) {
    this.db = db;
  }

  getAllSportEntries(): SportEntry[] {
    const stmt = this.db.prepare(`
      SELECT id, sport_scene_id, team_id, created_at, updated_at
      FROM sport_entries
      ORDER BY created_at DESC
    `);
    return stmt.all().map((row: any) => ({
      id: row.id,
      sportSceneId: row.sport_scene_id,
      teamId: row.team_id,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }));
  }

  getSportEntryById(id: string): SportEntry | null {
    const stmt = this.db.prepare(`
      SELECT id, sport_scene_id, team_id, created_at, updated_at
      FROM sport_entries
      WHERE id = ?
    `);
    const row = stmt.get(id) as any;
    if (!row) return null;

    return {
      id: row.id,
      sportSceneId: row.sport_scene_id,
      teamId: row.team_id,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  getSportEntriesBySportSceneId(sportSceneId: string): SportEntry[] {
    const stmt = this.db.prepare(`
      SELECT id, sport_scene_id, team_id, created_at, updated_at
      FROM sport_entries
      WHERE sport_scene_id = ?
      ORDER BY created_at DESC
    `);
    return stmt.all(sportSceneId).map((row: any) => ({
      id: row.id,
      sportSceneId: row.sport_scene_id,
      teamId: row.team_id,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }));
  }

  getSportEntriesByTeamId(teamId: string): SportEntry[] {
    const stmt = this.db.prepare(`
      SELECT id, sport_scene_id, team_id, created_at, updated_at
      FROM sport_entries
      WHERE team_id = ?
      ORDER BY created_at DESC
    `);
    return stmt.all(teamId).map((row: any) => ({
      id: row.id,
      sportSceneId: row.sport_scene_id,
      teamId: row.team_id,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }));
  }

  createSportEntry(input: CreateSportEntryInput): SportEntry {
    const now = new Date().toISOString();
    const id = ulid();

    const stmt = this.db.prepare(`
      INSERT INTO sport_entries (id, sport_scene_id, team_id, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?)
    `);

    stmt.run(id, input.sportSceneId, input.teamId, now, now);

    return {
      id,
      sportSceneId: input.sportSceneId,
      teamId: input.teamId,
      createdAt: now,
      updatedAt: now,
    };
  }

  updateSportEntry(
    id: string,
    input: UpdateSportEntryInput
  ): SportEntry | null {
    const now = new Date().toISOString();
    const current = this.getSportEntryById(id);
    if (!current) return null;

    const updates: string[] = [];
    const values: any[] = [];

    if (input.sportSceneId !== undefined) {
      updates.push("sport_scene_id = ?");
      values.push(input.sportSceneId);
    }

    if (input.teamId !== undefined) {
      updates.push("team_id = ?");
      values.push(input.teamId);
    }

    if (updates.length === 0) return current;

    updates.push("updated_at = ?");
    values.push(now);
    values.push(id);

    const stmt = this.db.prepare(`
      UPDATE sport_entries
      SET ${updates.join(", ")}
      WHERE id = ?
    `);

    stmt.run(...values);

    return this.getSportEntryById(id);
  }

  deleteSportEntry(id: string): boolean {
    const stmt = this.db.prepare("DELETE FROM sport_entries WHERE id = ?");
    const result = stmt.run(id);
    return result.changes > 0;
  }
}
