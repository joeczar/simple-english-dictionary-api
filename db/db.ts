// db.ts
import { Database } from 'bun:sqlite';

let db: Database | null = null;

export async function initializeDatabase() {
  if (db === null) {
    db = new Database('dictionary.sqlite');
    await createTables();
  }
  return db;
}

async function createTables() {
  db!.run(`
    CREATE TABLE IF NOT EXISTS words (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      word TEXT UNIQUE,
      meanings JSON,
      antonyms JSON,
      synonyms JSON
    )
  `);

  db!.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE,
      otp TEXT
    )
  `);

  db!.run(`
    CREATE TABLE IF NOT EXISTS submitted_definitions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      word_id INTEGER,
      user_id INTEGER,
      definition TEXT,
      approved BOOLEAN DEFAULT FALSE,
      FOREIGN KEY (word_id) REFERENCES words (id),
      FOREIGN KEY (user_id) REFERENCES users (id)
    )
  `);
}

export function getDb() {
  if (db === null || db === undefined) {
    throw new Error('Database not initialized');
  }
  return db;
}
