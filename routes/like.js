import express from 'express';
const router = express.Router();
import pool from '../db.js';
import { auth } from '../middleware/auth.js';

// like-unlike a post

router.post('/posts/:post_id/likes', auth, async (req, res) => {
  const { user_id } = req.user;
  const { post_id } = req.params;
  // check if the user has already liked this post
  let result = await pool.query(
    `SELECT * FROM likes WHERE user_id=$1 AND post_id=$2`,
    [user_id, post_id]
  );
  console.log(result.rows[0]);
  // if they have not liked it before then add to database
  if (!result.rows[0]) {
    try {
      await pool.query('INSERT INTO likes (user_id, post_id) VALUES ($1,$2)', [
        user_id,
        post_id,
      ]);
      // get new count of likes for that post
      let newLikes = await pool.query(
        `SELECT user_id FROM likes WHERE post_id=$1`,
        [post_id]
      );
      console.log(newLikes.rows);
      return res.json(newLikes.rows);
    } catch (err) {
      return res.status(500).json(err.message);
    }
  } else {
    // if they had already liked it remove their like
    try {
      await pool.query('DELETE FROM likes WHERE user_id=$1 AND post_id=$2', [
        user_id,
        post_id,
      ]);
      // get new count of likes for that post
      let newLikes = await pool.query(
        `SELECT user_id FROM likes WHERE post_id=$1`,
        [post_id]
      );
      return res.json(newLikes.rows);
    } catch (err) {
      return res.status(500).json(err.message);
    }
  }
});

// get all likes on a post
router.get('/posts/:post_id/likes', auth, async (req, res) => {
  const { post_id } = req.params;
  try {
    let result = await pool.query(
      `SELECT user_id FROM likes WHERE post_id=$1`,
      [post_id]
    );
    return res.json(result.rows);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err.message);
  }
});

// get all likes of a user
router.get('/users/:user_id/likedPosts', auth, async (req, res) => {
  const { user_id } = req.params;
  try {
    let result = await pool.query(
      `SELECT post_id FROM likes WHERE user_id=$1`,
      [user_id]
    );
    return res.json(result.rows);
  } catch (err) {
    return res.status(500).json(err.message);
  }
});

// get number of likes on a post
router.get('/posts/:post_id/likecount', auth, async (req, res) => {
  const { post_id } = req.params;
  try {
    let result = await pool.query(
      `SELECT COUNT(*) FROM likes WHERE post_id=$1`,
      [post_id]
    );
    return res.json({ likeCount: result.rows[0] });
  } catch (err) {
    return res.status(500).json(err.message);
  }
});

export default router;
