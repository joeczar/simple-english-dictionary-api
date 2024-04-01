// importData.ts
import fs from 'fs';
import { getDb } from './db.js';
import { Database } from 'bun:sqlite';

const countWordsQuery = (db: Database) => {
  const stmt = db.prepare('SELECT COUNT(*) as count FROM words');
  const { count } = stmt.get() as { count: number };
  return count as number;
};

export async function importDataFromJson() {
  const db = getDb();

  // Check if data has already been imported
  const count = countWordsQuery(db);
  if (count > 0) {
    console.log(
      `Data has already been imported. Skipping import process. Currently ${count} words in the database.`
    );
    return;
  }

  try {
    const data1 = JSON.parse(
      fs.readFileSync('./meaningsJson/meanings1.json', 'utf-8')
    ).data as Record<string, WordData>;
    const data2 = JSON.parse(
      fs.readFileSync('./meaningsJson/meanings2.json', 'utf-8')
    ).data as Record<string, WordData>;
    const mergedData = { ...data1, ...data2 };

    const insertWordStmt = db.prepare(`
      INSERT INTO words (word, meanings, antonyms, synonyms)
      VALUES (?, ?, ?, ?)`);

    db.transaction(() => {
      for (const word in mergedData) {
        const { WORD, MEANINGS, ANTONYMS, SYNONYMS } = mergedData[word];
        insertWordStmt.run(
          WORD,
          JSON.stringify(MEANINGS),
          JSON.stringify(ANTONYMS),
          JSON.stringify(SYNONYMS)
        );
      }
    });

    const countResult = countWordsQuery(db);
    console.log(
      `Data import completed successfully. ${countResult} words imported.`
    );
  } catch (error) {
    console.error('Error importing data:', error);
  }
}
