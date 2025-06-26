import Database from "better-sqlite3";
import { ulid } from "ulid";
import { Team, CreateTeamInput, UpdateTeamInput } from "../models/Team";

export class TeamRepository {
  private db: Database.Database;

  constructor(db: Database.Database) {
    this.db = db;
  }

  getAllTeams(): Team[] {
    const stmt = this.db.prepare(`
      SELECT t.id, t.name, t.group_id, t.created_at, t.updated_at,
             GROUP_CONCAT(ut.user_id) as user_ids
      FROM teams t
      LEFT JOIN user_teams ut ON t.id = ut.team_id
      GROUP BY t.id
    `);

    const rows = stmt.all() as any[];

    return rows.map((row) => ({
      id: row.id,
      name: row.name,
      groupId: row.group_id || undefined,
      userIds: new Set(row.user_ids ? row.user_ids.split(",") : []),
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }));
  }

  getTeamById(id: string): Team | null {
    const stmt = this.db.prepare(`
      SELECT t.id, t.name, t.group_id, t.created_at, t.updated_at,
             GROUP_CONCAT(ut.user_id) as user_ids
      FROM teams t
      LEFT JOIN user_teams ut ON t.id = ut.team_id
      WHERE t.id = ?
      GROUP BY t.id
    `);

    const row = stmt.get(id) as any;

    if (!row) return null;

    return {
      id: row.id,
      name: row.name,
      groupId: row.group_id || undefined,
      userIds: new Set(row.user_ids ? row.user_ids.split(",") : []),
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  createTeam(input: CreateTeamInput): Team {
    const id = ulid();
    const now = new Date().toISOString();

    const stmt = this.db.prepare(`
      INSERT INTO teams (id, name, group_id, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?)
    `);

    stmt.run(id, input.name, input.groupId || null, now, now);

    return {
      id,
      name: input.name,
      groupId: input.groupId,
      userIds: new Set(),
      createdAt: now,
      updatedAt: now,
    };
  }

  updateTeam(id: string, input: UpdateTeamInput): Team | null {
    const team = this.getTeamById(id);
    if (!team) return null;

    const updates: string[] = [];
    const values: any[] = [];

    if (input.name !== undefined) {
      updates.push("name = ?");
      values.push(input.name);
    }

    if (input.groupId !== undefined) {
      updates.push("group_id = ?");
      values.push(input.groupId || null);
    }

    if (updates.length === 0) return team;

    updates.push("updated_at = ?");
    values.push(new Date().toISOString());
    values.push(id);

    const stmt = this.db.prepare(`
      UPDATE teams SET ${updates.join(", ")} WHERE id = ?
    `);

    stmt.run(...values);

    return this.getTeamById(id);
  }

  deleteTeam(id: string): boolean {
    const stmt = this.db.prepare("DELETE FROM teams WHERE id = ?");
    const result = stmt.run(id);
    return result.changes > 0;
  }

  addUserToTeam(userId: string, teamId: string): boolean {
    const stmt = this.db.prepare(`
      INSERT OR IGNORE INTO user_teams (user_id, team_id, created_at)
      VALUES (?, ?, ?)
    `);

    const result = stmt.run(userId, teamId, new Date().toISOString());
    return result.changes > 0;
  }

  removeUserFromTeam(userId: string, teamId: string): boolean {
    const stmt = this.db.prepare(`
      DELETE FROM user_teams WHERE user_id = ? AND team_id = ?
    `);

    const result = stmt.run(userId, teamId);
    return result.changes > 0;
  }

  getTeamsByUserId(userId: string): Team[] {
    const stmt = this.db.prepare(`
      SELECT t.id, t.name, t.group_id, t.created_at, t.updated_at,
             GROUP_CONCAT(ut2.user_id) as user_ids
      FROM teams t
      INNER JOIN user_teams ut1 ON t.id = ut1.team_id AND ut1.user_id = ?
      LEFT JOIN user_teams ut2 ON t.id = ut2.team_id
      GROUP BY t.id
    `);

    const rows = stmt.all(userId) as any[];

    return rows.map((row) => ({
      id: row.id,
      name: row.name,
      groupId: row.group_id || undefined,
      userIds: new Set(row.user_ids ? row.user_ids.split(",") : []),
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }));
  }

  getUsersByTeamId(teamId: string): string[] {
    const stmt = this.db.prepare(`
      SELECT user_id FROM user_teams WHERE team_id = ?
    `);

    const rows = stmt.all(teamId) as any[];
    return rows.map((row) => row.user_id);
  }
}
