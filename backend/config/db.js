const path = process.env.NODE_ENV === "test" ? ".env.test" : ".env";

require("dotenv").config({
  path,
  override: true
});

const { Pool } = require("pg");

const pool = new Pool({
  host: process.env.PGHOST,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDB,
  port: process.env.PGPORT
});

if (process.env.NODE_ENV === "test") {
  console.log("Connected to TEST database:", process.env.PGDB);
}

module.exports = pool;