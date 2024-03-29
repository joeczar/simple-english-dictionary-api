import fs from 'fs';

async function wf(path: string, data: any) {
  try {
    await fs.promises.writeFile(path, JSON.stringify(data));
    console.log(`wrote ${path} file successfully`);
  } catch (err) {
    console.log(err, ' is err');
  }
}

function checkIfExist(path: string, callback: () => void) {
  if (fs.existsSync(path)) {
    console.log(`${path} already exists !!`);
  } else {
    callback();
  }
}

checkIfExist('processed/', function () {
  fs.mkdirSync('processed');
  console.log('wrote processed/ folder successfully');
});

checkIfExist('processed/meanings.json', function () {
  const data1 = JSON.parse(
    fs.readFileSync(`./meaningsJson/meanings1.json`).toString()
  ).data;
  const data2 = JSON.parse(
    fs.readFileSync(`./meaningsJson/meanings2.json`).toString()
  ).data;
  wf('./processed/meanings.json', { data: { ...data1, ...data2 } });
});

checkIfExist('processed/admin.json', function () {
  wf('./processed/admin.json', {
    data: {
      name: 'admin',
      password: 'admin',
      security: false,
      loggedIn: false,
    },
  });
});

checkIfExist('processed/queries.json', function () {
  wf('./processed/queries.json', { data: [] });
});
