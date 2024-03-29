import express from 'express';
import {
  adminToken,
  loginAdmin,
  securityQ,
  authAdmin,
  securityPage,
  secureAdmin,
  adminPage,
  logoutAdmin,
  forgotPass,
  passwordReset,
  changePass,
  getCredentials,
} from '../controller/auth.js';
import { verifyAdmin } from './adminRoute.js';
import { Hono } from 'hono';
import { readFileSync } from 'fs';

const authRouter = new Hono();

authRouter.get('/YWRtaW4uanMuc2NyaXB0.js', verifyAdmin, async (c) => {
  const filePath = '/path/to/your/admin/admin.js'; // Update the path to where your file is located
  const fileContent = readFileSync(filePath, 'utf8'); // Read the file content as a string
  c.res.headers.set('Content-Type', 'application/javascript'); // Set the correct Content-Type header
  return c.body(fileContent); // Send the file content as the response body
});

authRouter.get(
  '/c4031095857118d11646ae256ac52ae1',
  verifyAdmin,
  getCredentials
);
authRouter.post('/change', verifyAdmin, changePass);
//publically exposed admin routes
authRouter.get('/admin', adminPage);
authRouter.route('/login').get(loginAdmin).post(authAdmin);
authRouter.get('/security-questions', securityQ);
authRouter.route('/security').get(securityPage).post(secureAdmin);
authRouter.route('/admin-forgot-password').get(forgotPass).post(passwordReset);
authRouter.get('/logout', logoutAdmin);

export default authRouter;
