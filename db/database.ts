import type { Context } from 'hono';
import { getDb } from './db';

export function getWordById(id: number): WordData | null {
  const db = getDb();
  // Use prepared statements to pass values safely
  const stmt = db.prepare('SELECT * FROM words WHERE id = ?');
  const result = stmt.get(id);
  if (result) {
    const row = result as {
      word: string;
      meanings: string;
      antonyms: string;
      synonyms: string;
    };
    return {
      WORD: row.word,
      MEANINGS: JSON.parse(row.meanings),
      ANTONYMS: JSON.parse(row.antonyms),
      SYNONYMS: JSON.parse(row.synonyms),
    };
  }
  return null;
}

export function getWordByWord(word: string): WordData | null {
  const db = getDb();
  // Use prepared statements to pass values safely
  const stmt = db.prepare('SELECT * FROM words WHERE word = ?');
  const result = stmt.get(word);
  if (result) {
    const row = result as {
      word: string;
      meanings: string;
      antonyms: string;
      synonyms: string;
    };
    return {
      WORD: row.word,
      MEANINGS: JSON.parse(row.meanings),
      ANTONYMS: JSON.parse(row.antonyms),
      SYNONYMS: JSON.parse(row.synonyms),
    };
  }
  return null;
}

export function addWord(word: WordData): void {
  const db = getDb();
  // Use a single array for all values
  db.run(
    'INSERT INTO words (word, meanings, antonyms, synonyms) VALUES (?, ?, ?, ?)',
    [
      word.WORD,
      JSON.stringify(word.MEANINGS),
      JSON.stringify(word.ANTONYMS),
      JSON.stringify(word.SYNONYMS),
    ]
  );
}

export function updateWord(word: WordData): void {
  const db = getDb();
  // Use a single array for all values and ensure the order matches the SQL statement
  db.run(
    'UPDATE words SET meanings = ?, antonyms = ?, synonyms = ? WHERE word = ?',
    [
      JSON.stringify(word.MEANINGS),
      JSON.stringify(word.ANTONYMS),
      JSON.stringify(word.SYNONYMS),
      word.WORD,
    ]
  );
}

export function deleteWord(word: string): void {
  const db = getDb();
  // Use prepared statements to prevent SQL injection
  const stmt = db.prepare('DELETE FROM words WHERE word = ?');
  stmt.run(word);
}

export const getWordList = (c: Context) => {
  const db = getDb();
  const stmnt = db.prepare('SELECT word FROM words');
  const result = stmnt.all() as { word: string }[];
  if (result && Array.isArray(result) && result.length > 0) {
    const words = result.map((row) => row.word);
    c.status(200);
    return c.text(words.join(','));
  }
  c.status(404);
  return c.text('No words found');
};
