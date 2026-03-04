require("dotenv").config({ path: ".env.test" });

const pool = require("../../config/db");
const fs = require("fs");
const path = require("path");

module.exports = async () => {

  await pool.query(`
    DROP SCHEMA public CASCADE;
    CREATE SCHEMA public;
  `);

  const schema = fs.readFileSync(
    path.join(__dirname, "../../db/schema.sql"),
    "utf8"
  );

  await pool.query(schema);
};