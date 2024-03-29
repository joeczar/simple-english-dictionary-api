import { findOne, findTwo, contact } from '../controller/client.js';
import { Hono } from 'hono';

const clientRouter = new Hono();

clientRouter.get('/:word1/:word2', findTwo);
clientRouter.get('/:word', findOne);
clientRouter.post('/contact', contact);

export default clientRouter;
