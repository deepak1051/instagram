import pg from 'pg';
const { Pool } = pg;

// const pool = new Pool({
//   user: 'postgres',
//   password: process.env.postgresPassword,
//   database: 'instagram_database',
//   host: 'localhost',
//   port: 5432,
// });

const pool = new Pool({
  connectionString: process.env.CONN_STRING,

  ssl: {
    rejectUnauthorized: false,
  },
});

export default pool;
