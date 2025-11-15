const pool = require("../config/db");

async function findUserByEmail(email) {
  const query = `SELECT * FROM users WHERE email = $1`;
  const values = [email];

  const result = await pool.query(query, values);
  return result.rows[0] || null;
}

async function createUser(email, hashedPassword) {
  const query = `
    INSERT INTO users (email, password)
    VALUES ($1, $2)
    RETURNING id, email, created_at
  `;
  const values = [email, hashedPassword];

  const result = await pool.query(query, values);
  return result.rows[0];
}

module.exports = {
  findUserByEmail,
  createUser,
};
