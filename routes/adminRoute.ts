import {
  getQueries,
  downloadJson,
  remove,
  workWithWord,
} from '../controller/admin.js';
import { adminDetails } from '../data.js';
import { adminToken } from '../controller/auth.js';
import { Hono, type Context } from 'hono';
import type { HandlerResponse } from 'hono/types';

export const verifyAdmin = async (c: Context) => {
  if (adminDetails.loggedIn == false) {
    c.status(403);
    return c.json({ message: 'login as admin to access this route' });
  }
  if (c.req.query('token') !== adminToken) {
    c.status(401);
    return c.json({ message: 'Provide a valid admin token' });
  }
  if (c.req.query('token') == adminToken && adminDetails.loggedIn == true) {
    return c.json({}); // Return an empty response object
  }
  return c.json({}); // Return an empty response object
};

const adminRouter = new Hono();
adminRouter.use(verifyAdmin);

adminRouter.get('/queries', getQueries);
adminRouter.get('/downloadJson', downloadJson);
adminRouter.delete('/remove', remove);
adminRouter.post('/word_work', workWithWord);

export default adminRouter;
