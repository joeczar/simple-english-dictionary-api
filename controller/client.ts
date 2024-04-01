import { type Context } from 'hono';
import myData, { queries, pushData } from '../data.js';
import { getWordByWord } from '../db/database.js';
import { getDb } from '../db/db.js';

// Function to find the meaning of a word with strict typings
function findMeaning(word: string): WordData | DictError {
  const meaningObj = getWordByWord(word.toUpperCase());
  if (meaningObj) return meaningObj;
  const err: DictError & { err: string } = {
    err: `word ${word.toUpperCase()} doesn't exist in dictionary`,
  };
  return err;
}

// Generate a unique identifier
export function uid(): string {
  return Math.random().toString(36).slice(2);
}

// Hono functions with strict typings
export const findOne = (c: Context) => {
  let meaning = findMeaning(c.req.param('word'));
  if (c.req.query('q') == 'exists') {
    if ('err' in meaning) {
      return c.json({ result: false });
    }
    return c.json([meaning]);
  }
  return c.json([meaning]);
};

export const findTwo = (c: Context) => {
  let word1 = c.req.param('word1');
  let word2 = c.req.param('word2');
  let meaning1 = findMeaning(word1);
  let meaning2 = findMeaning(word2);
  return c.json([meaning1, meaning2]);
};

export const contact = (c: Context) => {
  let newData = { ...c.req.parseBody(), id: uid(), time: new Date() };
  pushData('queries', [...queries, newData]);
  return c.json({ result: 'success' });
};
