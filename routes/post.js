import express from 'express';
const router = express.Router();
import pool from '../db.js';
import { auth } from '../middleware/auth.js';

// create a post
router.post('/posts', auth, async (req, res) => {
  try {
    const { image, caption } = req.body;
    const { user_id } = req.user;

    const newPost = await pool.query(
      'INSERT INTO posts (user_id, image, caption) VALUES ($1,$2,$3) RETURNING *',
      [user_id, image, caption]
    );

    res.json(newPost.rows[0]);
  } catch (error) {
    res.status(404).json(error.message);
  }
});

// get all posts
router.get('/posts', auth, async (req, res) => {
  try {
    const response = await pool.query(
      'SELECT * FROM posts INNER JOIN users ON posts.user_id=users.user_id'
    );
    res.json(response.rows);
  } catch (err) {
    res.status(404).json(err.message);
  }
});

// get single post by ID
router.get('/posts/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `SELECT * FROM posts INNER JOIN users ON posts.user_id=users.user_id WHERE posts.post_id=$1`,
      [id]
    );
    console.log(result.rows);
    if (!result.rowCount)
      return res.status(404).send({ message: 'No Post found' });
    else return res.status(200).send(result.rows[0]);
  } catch (err) {
    res.status(404).json(err.message);
  }
});

// delete a post
router.delete('/posts/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(`DELETE FROM posts WHERE id=$1`, [id]);
    if (!result.rowCount)
      return res.status(404).send({ message: 'No Post found' });
    else return res.status(200).send({ message: 'Deleted Successfully!' });
  } catch (err) {
    res.status(404).json(err.message);
  }
});

// get all posts from a user
router.get('/users/:user_id/posts', auth, async (req, res) => {
  try {
    const { user_id } = req.params;
    const result = await pool.query(
      `SELECT * FROM posts INNER JOIN users ON posts.user_id=users.user_id WHERE posts.user_id = $1`,
      [user_id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(404).json(err.message);
  }
});

export default router;
