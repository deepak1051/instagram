import 'dotenv/config.js';
import express from 'express';
import cookieParser from 'cookie-parser';
const app = express();
import pool from './db.js';
import cors from 'cors';
import userRoutes from './routes/user.js';
import postRoutes from './routes/post.js';
import commentRoutes from './routes/comment.js';
import followRoutes from './routes/follow.js';
import likeRoutes from './routes/like.js';

import path from 'path';

async function getPostgresVersion() {
  let client;
  try {
    client = await pool.connect();
    const res = await client.query('SELECT version()');
    console.log(res.rows[0]);
  } catch (err) {
    console.log('Err neon connection', err);
  } finally {
    client.release();
  }
}

getPostgresVersion();

app.use(express.json());
app.use(cors({ credentials: true, origin: 'http://localhost:5173' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/api', userRoutes);
app.use('/api', postRoutes);
app.use('/api', commentRoutes);
app.use('/api', followRoutes);
app.use('/api', likeRoutes);

if (process.env.NODE_ENV === 'production') {
  const __dirname = path.resolve();
  console.log(__dirname);
  app.use(express.static(path.join(__dirname, '/client/dist')));

  app.get('*', (req, res) =>
    res.sendFile(path.resolve(__dirname, 'client', 'dist', 'index.html'))
  );
} else {
  // const __dirname = path.resolve();
  // app.use('/uploads', express.static(path.join(__dirname, '/uploads')));
  app.get('/', (req, res) => {
    res.send('API is running....');
  });
}

app.use((err, req, res, next) => {
  const statusCode = res.statusCode ? res.statusCode : 500;

  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : null,
  });
});

app.listen(5000, () => {
  console.log('server is running on port 5000');
});
