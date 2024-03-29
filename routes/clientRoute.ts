import { findOne, findTwo, contact } from '../controller/client.js';
import { Hono } from 'hono';

export const clientRouter = new Hono()
  .get('/', (c) => c.json({ message: 'Welcome to the dictionary' }))
  .get('/:word1/:word2', findTwo)
  .get('/:word', findOne)
  .post('/contact', contact);