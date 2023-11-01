import jwt from 'jsonwebtoken';

import pool from '../db.js';

export const auth = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    console.log(req.cookies);
    console.log(token);
    if (!token) {
      return res.status(401).json('Not authorized, please login');
    }

    //verify token
    const verify = jwt.verify(token, process.env.JWT_SECRET);
    console.log(verify);
    const user = await pool.query(
      `SELECT user_id,email FROM users WHERE user_id=$1`,
      [verify.id]
    );

    if (!user.rows[0]) {
      res.status(400);
      return res.status(401).json('User not found');
    }

    req.user = user.rows[0];
    next();
  } catch (error) {
    res.status(401);
    return res.status(401).json('Not authorized, please login');
  }
};
