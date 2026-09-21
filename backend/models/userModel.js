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

async function getByUserId(userId) {
  const { rows } = await pool.query(
    `SELECT goal, calorie_target, protein_target, fat_target, carbs_target, copy_targets_to_new_months from users 
  WHERE id=$1`,
    [userId]
  );

  return rows[0];
}

async function updateUserSettings(userId, settings) {
  const { goal, calorie_target, protein_target, fat_target, carbs_target, copy_targets_to_new_months } = settings;
  const { rows } = await pool.query(
    `UPDATE users SET goal=$2, calorie_target=$3, protein_target=$4, fat_target=$5, carbs_target=$6, copy_targets_to_new_months=$7
    WHERE id=$1 RETURNING goal, calorie_target, protein_target, fat_target, carbs_target, copy_targets_to_new_months`,
    [userId, goal, calorie_target, protein_target, fat_target, carbs_target, copy_targets_to_new_months]
  );
  return rows[0];
}

module.exports = {
  findUserByEmail,
  createUser,
  getByUserId,
  updateUserSettings
};
