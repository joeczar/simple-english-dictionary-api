import { type Context } from 'hono';
import { uid } from './client.js';
import { adminDetails, reWriteAdminData } from '../data.js';
import type { HandlerResponse } from 'hono/types';

export let adminToken = uid();
const Questions = [
  {
    ask: 'What was the name of your first-grade teacher?',
    short: 'teacher',
  },
  {
    ask: 'What is the name of your first pet?',
    short: 'pet',
  },
  {
    ask: 'What is the name of the city where you were born?',
    short: 'cityname',
  },
  {
    ask: 'What was your first job?',
    short: 'job',
  },
  {
    ask: 'What is your favorite vacation spot?',
    short: 'vacation',
  },
];

setInterval(function () {
  adminToken = uid();
  adminDetails.loggedIn = false;
  //change admin token and logout every 5 minutes for security
}, 1000 * 60 * 5);

export function securityQ(c: Context) {
  return c.json(Questions);
}

export function loginAdmin(c: Context) {
  adminDetails.loggedIn = true;
  return c.redirect('/admin/login.html');
}

export function getCredentials(c: Context): HandlerResponse<any> {
  let adminObj = {
    name: adminDetails.name,
    password: adminDetails.password,
    moreInfo: {
      name_of_first_grade_teacher: adminDetails.q.teacher,
      name_of_first_pet: adminDetails.q.pet,
      name_of_city_you_were_born: adminDetails.q.cityname,
      first_job: adminDetails.q.job,
      favorite_vacation_spot: adminDetails.q.vacation,
    },
  };
  return c.json(adminObj);
}

export async function authAdmin(c: Context) {
  let { name, pass } = await c.req.parseBody();
  if (name == adminDetails.name && pass == adminDetails.password) {
    adminToken = uid();
    return c.json({ success: true, adminToken });
  }
  if (adminDetails.name !== name && adminDetails.password !== pass) {
    return c.json({
      success: false,
      message: 'Username and Password are wrong',
    });
  } else if (adminDetails.name !== name) {
    return c.json({ success: false, message: 'Wrong username' });
  } else if (adminDetails.password !== pass) {
    return c.json({ success: false, message: 'Wrong password' });
  }
  c.status(403);
  c.json({ message: 'Please provide username amd password' });
}

export function securityPage(c: Context) {
  if (adminDetails.loggedIn == true) {
    return c.redirect('/admin/security.html');
  }
  return c.redirect('/login');
}

export async function secureAdmin(c: Context) {
  let newDetails: { [key: string]: any } = {};
  const body = (await c.req.parseBody()) as { details: any[] };

  if (body.details && Array.isArray(body.details)) {
    for (let detail of body.details) {
      newDetails = { ...newDetails, ...detail };
    }
  }

  newDetails = { ...adminDetails, q: { ...newDetails } };
  newDetails['security'] = true;
  reWriteAdminData(newDetails);
  console.log(newDetails);
  return c.json({ success: true, adminToken });
}

export function adminPage(c: Context): HandlerResponse<any> {
  let token = c.req.query('token');
  if (adminDetails['security'] == false) {
    return c.redirect('/security');
  }
  if (token == adminToken) {
    return c.redirect('/admin/index.html');
  }
  return c.redirect('/login');
}

export function logoutAdmin(c: Context) {
  adminToken = uid();
  adminDetails.loggedIn = false;
  return c.json({ success: true });
}

export function forgotPass(c: Context) {
  if (adminDetails['security'] == true) {
    return c.redirect('admin/forgotpass.html');
  }
  c.status(403);
  return c.json({ message: 'Please sign in as admin to access this route' });
}

export async function passwordReset(c: Context) {
  if (adminDetails['security'] === false) {
    c.status(403);
    return c.json({ message: 'Please sign in as admin to access this route' });
  }

  const body = (await c.req.parseBody()) as { [key: string]: string };
  let adminQs = adminDetails.q;
  let matchCount = 0;

  // Check for matches between the provided answers and the stored security questions
  for (const key of Object.keys(body)) {
    if (body[key] === adminQs[key]) {
      matchCount++;
    }
  }

  if (matchCount >= 3) {
    adminDetails.name = 'admin';
    adminDetails.password = 'admin';
    reWriteAdminData(adminDetails);
    adminToken = uid();
    return c.json({
      success: true,
      adminToken,
      message:
        "Admin username and password are reset to 'admin' successfully. Please change password after logging in for security.",
    });
  }

  return c.json({ success: false });
}

export async function changePass(c: Context) {
  let { prevPass, name, newPass } = await c.req.parseBody();
  if (prevPass !== adminDetails.password) {
    return c.json({
      success: false,
      type: 'danger',
      message: 'You have entered wrong previous password',
    });
  }
  adminDetails.name = name;
  adminDetails.password = newPass;
  reWriteAdminData(adminDetails);
  c.json({
    success: true,
    type: 'success',
    message: 'successfully changed admin credentials',
  });
}
