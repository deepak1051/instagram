import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
  user: 'postgres',
  password: 'Deepak@123',
  database: 'instagram_database',
  host: 'localhost',
  port: 5432,
});

// const pool = new Pool({
//   connectionString:
//     'postgres://deepakpanwar1051:g4MWw5jGQTfF@ep-weathered-disk-02994644.ap-southeast-1.aws.neon.tech/neondb',
//   // connectionString:
//   //   'postgres://deepak1051:MWmvn2FVl8Kq@ep-fancy-firefly-85782086.ap-southeast-1.aws.neon.tech/neondb',
//   ssl: {
//     rejectUnauthorized: false,
//   },
// });

// const { Pool } = require('pg');
// require('dotenv').config();

// const { DATABASE_URL } = process.env;

// const pool = new Pool({
//   connectionString: DATABASE_URL,
//   ssl: {
//     rejectUnauthorized: false,
//   },
// });

export default pool;
