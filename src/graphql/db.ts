import { Pool } from "pg";

let pool;
if (process.env.POSTGRES_URL !== undefined) {
  pool = new Pool({
    connectionString: process.env.POSTGRES_URL,
    max: 10,
    idleTimeoutMillis: 30000,
  });
} else {
  pool = new Pool({
    host: "localhost",
    port: 5432,
    database: process.env.POSTGRES_DB,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
  });
}

export { pool };
