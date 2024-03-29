import fs from 'fs';
import myData, {
  queries,
  removeQuery,
  addWord,
  removeWord,
  editWord,
} from '../data.js';
import type { Context } from 'hono';
import type { BodyData } from 'hono/utils/body';
import { type HandlerResponse } from 'hono/types';

export function getQueries(c: Context) {
  return c.json({ queries, dataLength: Object.keys(myData).length });
}

export function downloadJson(c: Context) {
  let file = c.req.query('file');
  console.log('received a download req for ' + file);
  if (file == 'queries') {
    return c.json({ data: queries });
  }

  const filterDataByStartingLetters = (
    startingLetters: string[],
    myData: WordData
  ): any[] => {
    let data: any[] = [];
    for (let key in myData) {
      let word = key;
      if (startingLetters.includes(word.charAt(0))) {
        data.push(myData[key as keyof WordData]);
      }
    }
    return data;
  };

  switch (file) {
    case 'a-c':
      return c.json({
        data: filterDataByStartingLetters(['A', 'B', 'C'], myData),
      });
    case 'd-f':
      return c.json({
        data: filterDataByStartingLetters(['D', 'E', 'F'], myData),
      });
    case 'g-i':
      return c.json({
        data: filterDataByStartingLetters(['G', 'H', 'I'], myData),
      });
    case 'j-l':
      return c.json({
        data: filterDataByStartingLetters(['J', 'K', 'L'], myData),
      });
    case 'm-o':
      return c.json({
        data: filterDataByStartingLetters(['M', 'N', 'O'], myData),
      });
    case 'p-r':
      return c.json({
        data: filterDataByStartingLetters(['P', 'Q', 'R'], myData),
      });
    case 's-u':
      return c.json({
        data: filterDataByStartingLetters(['S', 'T', 'U'], myData),
      });
    case 'v-z':
      return c.json({
        data: filterDataByStartingLetters(['V', 'W', 'X', 'Y', 'Z'], myData),
      });
    default:
      console.log(`error: ${file} not found !!`);
      return c.json({ err: 'no such file exists' });
  }
}

export function remove(c: Context): HandlerResponse<any> {
  removeQuery(c.req.query('id'));
  return c.json(queries);
}

export async function workWithWord(c: Context) {
  let body = await c.req.parseBody();
  let opt = c.req.query('opt');
  body = body[0] as unknown as BodyData;
  switch (opt) {
    case 'Add':
      addWord(body);
      return c.json({
        result: 'success',
        message: `Added Word "${body.WORD}" In the API successfully.`,
      });
      break;
    case 'Remove':
      removeWord(body);
      return c.json({
        result: 'success',
        message: `Removed Word "${body.WORD}" from the API successfully.`,
      });
      break;
    case 'Edit':
      editWord(body);
      return c.json({
        result: 'success',
        message: `Edited Word "${body}" In the API successfully.`,
      });
      break;
    default:
      c.status(400);
      return c.json({
        result: 'danger',
        message: "Looks like your query can't be resolved !!",
      });
  }
}
