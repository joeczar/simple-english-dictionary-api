import fs from 'fs';
import { type BodyData } from 'hono/utils/body';

const parsedData = readData('meanings');
const myData = parsedData.data;
const queryData = readData('queries');
let queries = queryData.data;

export let adminDetails = readData('admin').data;

function readData(fName: string) {
  let db = fs.readFileSync(`./processed/${fName}.json`).toString();
  return JSON.parse(db);
}

function pushData(path: string, obj: any) {
  fs.writeFile(
    `./processed/${path}.json`,
    JSON.stringify({ data: obj }),
    (err) => {
      if (err) console.log('err occurred while writing data');
      else {
        console.log(`wrote new data to ${path}.json file successfully`);
      }
    }
  );
}

function removeQuery(id: string | undefined) {
  queries = queries.filter((obj: { id: any }) => obj.id !== id);
  pushData('queries', queries);
}

function addWord(obj: BodyData) {
  let WORD: string = obj.WORD as string;

  if (Object.keys(myData).includes(WORD)) {
    return;
  }
  myData[WORD] = obj;
  pushData('meanings', myData);
}
function removeWord(obj: BodyData) {
  let WORD: string = obj.WORD as string;
  delete myData[WORD];
  pushData('meanings', myData);
}
function editWord(obj: BodyData) {
  let WORD: string = obj.WORD as string;
  myData[WORD] = obj;
  pushData('meanings', myData);
}

function reWriteAdminData(obj: { [key: string]: any }) {
  adminDetails = obj;
  console.log(adminDetails);
  pushData('admin', obj);
}

export {
  pushData,
  queries,
  removeQuery,
  addWord,
  removeWord,
  editWord,
  reWriteAdminData,
};
export default myData;
