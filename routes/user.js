import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
const router = express.Router();
import pool from '../db.js';
import { auth } from '../middleware/auth.js';

// user sign-up

export const genToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1d' });
};

router.post('/signup', async (req, res) => {
  try {
    const { email, name, password } = req.body;

    console.log(typeof password);

    if (!name || !email || !password) {
      return res.status(400).json('Please fill in all the required fields.');
    }

    if (password.length < 4) {
      res.status(400).json('Password must be up to 4 characters.');
    }

    const existUser = await pool.query('SELECT * FROM users WHERE email=$1', [
      email,
    ]);

    if (existUser.rows[0]) {
      return res.status(400).json('User already exists.');
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = await pool.query(
      'INSERT INTO users (email,name,password) VALUES ($1,$2,$3) RETURNING *',
      [email, name, hashPassword]
    );

    // Generate Token
    console.log(newUser.rows[0].user_id);
    const token = genToken(newUser.rows[0].user_id);

    // Send HTTP-only cookie

    res.cookie('token', token, {
      path: '/',
      httpOnly: true,
      expires: new Date(Date.now() + 1000 * 86400), // 1 day

      secure: process.env.NODE_ENV !== 'development', // Use secure cookies in production
      sameSite: 'strict', // Prevent CSRF attacks
    });

    console.log(token);
    return res.json(newUser.rows[0]);
  } catch (error) {
    res.status(404).json(error.message);
  }
});

// user login

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json('Please add email and password');
    }

    const user = await pool.query('SELECT * FROM users WHERE email=$1 ', [
      email,
    ]);

    if (!user.rows[0]) return res.status(404).json('email does not exist');

    const isValid = await bcrypt.compare(password, user.rows[0].password);

    if (!isValid) return res.status(400).json('wrong password');

    const token = genToken(user.rows[0].user_id);

    // Send HTTP-only cookie

    res.cookie('token', token, {
      path: '/',
      httpOnly: false,
      expires: new Date(Date.now() + 1000 * 86400), // 1 day
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development', // Use secure cookies in production
      sameSite: 'strict', // Prevent CSRF attacks
    });

    return res.json(user.rows[0]);
  } catch (error) {
    res.status(404).json(error.message);
  }
});

// get all users data

router.get('/allUsers', auth, async (req, res) => {
  try {
    const { user_id } = req.user;
    const allUsers = await pool.query(
      `SELECT *,1 AS isFollowed FROM users WHERE user_id != $1 AND 
      user_id IN (SELECT followed_user_id FROM follow WHERE follow.user_id=$1) 
      UNION ALL
      SELECT *,0 AS isFollowed FROM users WHERE user_id != $1 AND 
      user_id NOT IN (SELECT followed_user_id FROM follow WHERE follow.user_id=$1) 
      `,
      [user_id]
    );
    res.json(allUsers.rows);
  } catch (err) {
    res.status(404).json(err.message);
  }
});

//get a single user detail

router.get('/users/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { user_id } = req.user;
    const user = await pool.query(
      `
      SELECT *,
      CASE 
        WHEN $3 THEN 2
        WHEN $2 IN (SELECT followed_user_id FROM follow WHERE follow.user_id=$1) THEN 1
        ELSE 0
      END AS isFollowed
      FROM users WHERE user_id=$2`,
      [user_id, id, id == user_id]
    );

    if (!user.rows[0]) {
      return res.status(404).json('user not found!');
    }
    res.json(user.rows[0]);
  } catch (err) {
    res.status(500).json(err.message);
  }
});

router.get('/me', auth, (req, res) => {
  res.json(req.user);
});

// logout user
router.get('/logout', auth, (req, res) => {
  res.cookie('token', '', { httpOnly: true, expires: new Date(0) });
  res.status(200).json({ message: 'user logged out ' });
});

// update user bio and profile pic

router.put('/updateProfile', auth, async (req, res) => {
  try {
    const { user_id } = req.user;
    const { bio, profilepic } = req.body;

    if (!bio.trim()) {
      return res.status(400).json('Please Enter Bio');
    }
    const result = await pool.query(
      `UPDATE users SET bio=$1,profilepic=$2 WHERE user_id=$3`,
      [bio, profilepic, user_id]
    );
    return res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json(error.message);
  }
});

export default router;
