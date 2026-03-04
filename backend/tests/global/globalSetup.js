require("dotenv").config({ path: ".env.test" });

if (process.env.NODE_ENV !== "test") {
  throw new Error("Tests must run with NODE_ENV=test");
}

if (process.env.PGDB !== "easykcal_test") {
  throw new Error("Tests cannot run on non-test database!");
}

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

  await pool.query("SET search_path TO public");

  const seed = fs.readFileSync(
    path.join(__dirname, "../../db/seeds.sql"),
    "utf8"
  );

  await pool.query(seed);
};