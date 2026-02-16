const pool = require("../config/db");

const CategoryModel = {
  async getAllForUser(userId) {
    const { rows } = await pool.query(
      `SELECT *
      FROM categories
      WHERE user_id IS NULL
         OR user_id = $1
      ORDER BY name ASC`,
      [userId]
    );

    return rows;
  }
};

module.exports = CategoryModel;