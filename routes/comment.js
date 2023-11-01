import express from 'express';
const router = express.Router();
import pool from '../db.js';
import { auth } from '../middleware/auth.js';

// post a comment
router.post('/posts/:post_id/comments', auth, async (req, res) => {
  try {
    const { user_id, text } = req.body;
    const { post_id } = req.params;
    const newComment = await pool.query(
      'INSERT INTO comments (user_id, post_id, text) VALUES ($1,$2,$3) RETURNING *',
      [user_id, post_id, text]
    );
    console.log(newComment);
    res.json(newComment.rows[0]);
  } catch (error) {
    console.error(error.message);
    res.status(404).json(error.message);
  }
});

// get all comments
router.get('/posts/:post_id/comments', auth, async (req, res) => {
  try {
    const { post_id } = req.params;
    const result = await pool.query(
      `SELECT * FROM comments INNER JOIN users ON comments.user_id=users.user_id WHERE comments.post_id=$1 ORDER BY createdon DESC`,
      [post_id]
    );
    return res.status(200).send(result.rows);
  } catch (err) {
    console.log(err.stack);
    res.sendStatus(500);
  }
});

//reply a comment
router.post(
  '/posts/:post_id/comments/:comment_id/replies',
  auth,
  async (req, res) => {
    try {
      const { user_id, text } = req.body;
      const { comment_id } = req.params;
      const newComment = await pool.query(
        'INSERT INTO comment_reply (user_id, parent_comment_id, text) VALUES ($1,$2,$3) RETURNING *',
        [user_id, comment_id, text]
      );
      console.log(newComment);
      res.json(newComment);
    } catch (error) {
      console.error(error.message);
      res.status(404).json(error.message);
    }
  }
);

//get all replies on comment
router.get(
  '/posts/:post_id/comments/:comment_id/replies',
  auth,
  async (req, res) => {
    try {
      const { comment_id } = req.params;
      const result = await pool.query(
        `SELECT * FROM comment_reply INNER JOIN users ON comment_reply.user_id=users.user_id WHERE comment_reply.parent_comment_id=$1 ORDER BY createdon DESC`,
        [comment_id]
      );
      return res.status(200).send(result.rows);
    } catch (err) {
      console.log(err.stack);
      res.sendStatus(500);
    }
  }
);

// delete a comment
router.delete(
  '/posts/:post_id/comments/:comment_id',
  auth,
  async (req, res) => {
    try {
      const { user_id } = req.user;
      const { post_id, comment_id } = req.params;

      const comment_user_id = await pool.query(
        `SELECT user_id from comments WHERE comment_id=$1`,
        [comment_id]
      );

      if (comment_user_id.rows[0].user_id != user_id) {
        return res
          .status(404)
          .json('You are not authorized to delete other users comment');
      }

      const result = await pool.query(
        `DELETE from comments WHERE comment_id=$1 RETURNING *`,
        [comment_id]
      );
      return res.status(200).json(result.rows);
    } catch (error) {
      console.log(error.message);
      res.sendStatus(500).json(error.message);
    }
  }
);

export default router;
