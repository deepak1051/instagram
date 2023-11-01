import express from 'express';
const router = express.Router();
import pool from '../db.js';
import { auth } from '../middleware/auth.js';

// follow a user
router.post('/follow', auth, async (req, res) => {
  const { user_id, followed_user_id } = req.body;
  try {
    await pool.query(
      `INSERT INTO follow (user_id, followed_user_id) VALUES ($1,$2) RETURNING *`,
      [user_id, followed_user_id]
    );
    res.status(201).json('user followed');
  } catch (error) {
    res.status(400).json(err.message);
  }
});

// unfollow a user
router.post('/unfollow', auth, async (req, res) => {
  const { user_id, followed_user_id } = req.body;
  try {
    await pool.query(
      `DELETE FROM follow WHERE user_id=$1 AND followed_user_id=$2`,
      [user_id, followed_user_id]
    );

    res.status(201).json('user unfollowed');
  } catch (error) {
    res.status(400).json(err.message);
  }
});

// get all followings
router.get('/:user_id/:id/allFollowings', auth, async (req, res) => {
  let { user_id, id } = req.params;
  try {
    const result = await pool.query(
      `SELECT *,2 AS isFollowed FROM users INNER JOIN  follow ON follow.followed_user_id=users.user_id WHERE follow.user_id=$2 AND users.user_id = $1
      UNION ALL
      SELECT *,1 AS isFollowed FROM users INNER JOIN  follow ON follow.followed_user_id=users.user_id WHERE follow.user_id=$2 AND users.user_id != $1 
      AND 
      users.user_id IN (SELECT followed_user_id FROM follow WHERE follow.user_id=$1) 
      UNION ALL
      SELECT *,0 AS isFollowed FROM users INNER JOIN  follow ON follow.followed_user_id=users.user_id WHERE follow.user_id=$2 AND users.user_id != $1 
      AND 
      users.user_id NOT IN (SELECT followed_user_id FROM follow WHERE follow.user_id=$1) 
      `,
      [user_id, id]
    );
    return res.json(result.rows);
  } catch (err) {
    res.status(400).json(err.message);
  }
});

// get all followers
router.get('/:user_id/:id/allFollowers', auth, async (req, res) => {
  let { user_id, id } = req.params;
  try {
    const result = await pool.query(
      `SELECT *,2 AS isFollowed FROM follow INNER JOIN users ON follow.user_id=users.user_id WHERE follow.followed_user_id=$2 AND users.user_id = $1
      UNION ALL
      SELECT *,1 AS isFollowed FROM follow INNER JOIN users ON follow.user_id=users.user_id WHERE follow.followed_user_id=$2 AND users.user_id != $1 
            AND 
            users.user_id IN (SELECT followed_user_id FROM follow WHERE follow.user_id=$1) 
            UNION ALL
            SELECT *,0 AS isFollowed FROM follow INNER JOIN users ON follow.user_id=users.user_id WHERE follow.followed_user_id=$2 AND users.user_id != $1 
            AND 
            users.user_id NOT IN (SELECT followed_user_id FROM follow WHERE follow.user_id=$1) `,
      [user_id, id]
    );
    return res.json(result.rows);
  } catch (err) {
    res.status(400).json(err.message);
  }
});

export default router;
