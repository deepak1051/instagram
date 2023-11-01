CREATE DATABASE instagram_database;

CREATE TABLE imageurl(
  imageurl_id SERIAL PRIMARY KEY,
  url VARCHAR(255)
);

CREATE TABLE users(
  user_id SERIAL PRIMARY KEY,
  email VARCHAR(255),
  name VARCHAR(255),
  password VARCHAR(255),
  profilepic VARCHAR(255),
  bio TEXT,
  followers INTEGER DEFAULT 0 NOT NULL CHECK (followers >= 0),
  following INTEGER DEFAULT 0 NOT NULL CHECK (following >= 0),
  postcount INTEGER DEFAULT 0 NOT NULL CHECK (postcount >= 0),
  UNIQUE(email)
);

CREATE TABLE posts(
  post_id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
  image VARCHAR(255),
  caption TEXT,
  createdon TIMESTAMP DEFAULT NOW(),
  likes INTEGER DEFAULT 0 NOT NULL CHECK (likes >= 0),
  comments INTEGER DEFAULT 0 NOT NULL CHECK (comments >= 0)
);

CREATE TABLE likes(
  like_id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
  post_id INT REFERENCES posts(post_id) ON DELETE CASCADE,
  createdon TIMESTAMP DEFAULT NOW()
);

CREATE TABLE comments(
  comment_id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
  post_id INT REFERENCES posts(post_id) ON DELETE CASCADE,
  text TEXT,
  createdon TIMESTAMP DEFAULT NOW()
);

CREATE TABLE comment_reply(
  comment_reply_id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
  parent_comment_id INT REFERENCES comments(comment_id) ON DELETE CASCADE,
  text TEXT,
  createdon TIMESTAMP DEFAULT NOW()
);

CREATE TABLE follow(
  follow_id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
  followed_user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
  createdon TIMESTAMP DEFAULT NOW()
);