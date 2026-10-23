import sqlite3 from "sqlite3";
import {Database} from "sqlite";
import path from "node:path";
import fs from "node:fs";

/**
 * Initialize database (development/test environment only)
 * */
export const resetDB = async (
  db: Database<sqlite3.Database, sqlite3.Statement>,
): Promise<void> => {
  db.getDatabaseInstance().serialize(() => {
    deleteAllTable(db);
    createAllTable(db);
    insertInitialRecords(db);
  });
};

const deleteAllTable = (
  db: Database<sqlite3.Database, sqlite3.Statement>,
): void => {
  const ENTITY_TYPES = ["tasks"] as const;
  for (const entityType of ENTITY_TYPES) {
    db.exec(`DROP TABLE IF EXISTS ${entityType}`);
  }
};

const createAllTable = (
  db: Database<sqlite3.Database, sqlite3.Statement>,
): void => {
  executeSqlFile(db, path.join(path.resolve(), `src/db/schema.sql`));
};

const insertInitialRecords = (
  db: Database<sqlite3.Database, sqlite3.Statement>,
): void => {
  executeSqlFile(db, path.join(path.resolve(), `src/db/seed.sql`));
};

const executeSqlFile = (
  db: Database<sqlite3.Database, sqlite3.Statement>,
  filepath: string,
): void => {
  const sqlFile = fs.readFileSync(filepath, "utf8");
  const statements = sqlFile.split("\n");
  for (const statement of statements) {
    db.exec(statement);
  }
};
