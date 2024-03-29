import myData from './data.js';
import { clientRouter } from './routes/clientRoute.js';
import adminRouter from './routes/adminRoute.js';
import authRouter from './routes/authRoute.js';
import rateLimit from 'express-rate-limit';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { prettyJSON } from 'hono/pretty-json';
import { serveStatic } from '@hono/node-server/serve-static';
import type { Context } from 'hono';
import type { Context as JsxContext } from 'hono/jsx';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
// const limiter = rateLimit({
//   windowMs: 10 * 60 * 1000,
//   max: 400,
//   message: { status: 429, message: "Too many requests" },
// });

const app = new Hono();
const port = process.env.PORT || 3000;
const words = Object.keys(myData);

app.use(cors());
app.use(prettyJSON());
app.use('/', serveStatic({ root: '/public' }));

// app.use(limiter);

app.route('/admin/api', adminRouter);
app.route('/api', clientRouter);
app.route('/', authRouter);

app.get('/download/all/words', (c: Context) => {
  c.status(200);
  return c.text(words.join(','));
});

app.get('/', serveStatic({ path: '/public/index.html' }));
app.get('/script.js', serveStatic({ path: '/public/script.js' }));
app.get('/image.png', serveStatic({ path: '/public/image.png' }));

export default {
  port: 3000,
  fetch: app.fetch.bind(app),
};
