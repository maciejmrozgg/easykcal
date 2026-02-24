const { Pool } = require("pg");
const fs = require("fs");
const path = require("path");
require("dotenv").config({ path: ".env.test" });

module.exports = async () => {
  const pool = new Pool({
    host: process.env.PGHOST,
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    database: process.env.PGDB,
    port: process.env.PGPORT,
  });

  await pool.query(`
    DROP SCHEMA public CASCADE;
    CREATE SCHEMA public;
  `);

  const schema = fs.readFileSync(
    path.join(__dirname, "../../db/schema.sql"),
    "utf8"
  );

  await pool.query(schema);

  await pool.end();
};