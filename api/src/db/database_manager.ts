import sqlite3 from "sqlite3";
import {open, Database} from "sqlite";

class DatabaseManager {
  private database?: Database<sqlite3.Database, sqlite3.Statement>;

  // Returns a sqlite#Database. See https://www.npmjs.com/package/sqlite for
  // more information.
  async getInstance(): Promise<Database<sqlite3.Database, sqlite3.Statement>> {
    if (!this.database) {
      this.database = await open({
        filename: process.env.DB_PATH as string,
        driver: sqlite3.Database,
      });
    }
    return this.database;
  }

  async close(): Promise<void> {
    if (!this.database) return;
    await this.database.close();
  }
}

export const databaseManager = new DatabaseManager();
