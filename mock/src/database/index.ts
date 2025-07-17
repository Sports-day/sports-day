import Database from "better-sqlite3";
import { schema } from "./schema";

class DatabaseManager {
  private db: Database.Database | null = null;

  initialize(): Database.Database {
    if (this.db) {
      return this.db;
    }

    // Create in-memory SQLite database
    this.db = new Database(":memory:");

    // Enable foreign keys
    this.db.pragma("foreign_keys = ON");

    // Create tables
    this.db.exec(schema);

    console.log("✅ In-memory SQLite database initialized");

    return this.db;
  }

  getDatabase(): Database.Database {
    if (!this.db) {
      throw new Error("Database not initialized. Call initialize() first.");
    }
    return this.db;
  }

  close(): void {
    if (this.db) {
      this.db.close();
      this.db = null;
      console.log("✅ Database connection closed");
    }
  }
}

// Export singleton instance
export const dbManager = new DatabaseManager();
