import myData from './data.js';
import { clientRouter } from './routes/clientRoute.js';
import adminRouter from './routes/adminRoute.js';
import authRouter from './routes/authRoute.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { prettyJSON } from 'hono/pretty-json';
import { serveStatic } from '@hono/node-server/serve-static';
import type { Context } from 'hono';
import { rateLimiter } from 'hono-rate-limiter';
import { uid } from './controller/client.js';
import { getDb, initializeDatabase } from './db/db.js';
import { importDataFromJson } from './db/importData.js';
import { getWordList } from './db/database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const limiter = rateLimiter({
  windowMs: 10 * 60 * 1000, // 10 minutes
  limit: 400,
  standardHeaders: 'draft-6', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
  message: { status: 429, message: 'Too many requests' },
  keyGenerator: (c) => uid(), // Method to generate custom identifiers for clients.
  // store: ... , // Redis, MemoryStore, etc. See below.
});

const app = new Hono();
const words = Object.keys(myData);

initializeDatabase();
await importDataFromJson();

app.use(cors());
app.use(prettyJSON());
app.use('/', serveStatic({ root: '/public' }));

app.use(limiter);

app.route('/admin/api', adminRouter);
app.route('/api', clientRouter);
app.route('/', authRouter);

app.get('/download/all/words', getWordList);

app.get('/download/all/words', (c: Context) => {
  c.status(200);
  return c.text(words.join(','));
});

app.get('/', serveStatic({ path: '/public/index.html' }));
app.get('/script.js', serveStatic({ path: '/public/script.js' }));
app.get('/image.png', serveStatic({ path: '/public/image.png' }));

export default {
  port: process.env.PORT || 3000,
  fetch: app.fetch.bind(app),
};
