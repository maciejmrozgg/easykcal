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
  },

  async create(userId, name) {
    const { rows } = await pool.query(
      `INSERT INTO categories (user_id, name, image_url)
      VALUES ($1, $2, NULL)
      RETURNING *`,
      [userId, name]
    );

    return rows[0];
  },

  async update(id, userId, name) {
    const { rows } = await pool.query(
      `UPDATE categories
       SET name = $1
       WHERE id = $2
         AND user_id = $3
       RETURNING *`,
      [name, id, userId]
    );

    return rows[0];
  },

  async delete(id, userId) {
    const { rowCount } = await pool.query(
      `DELETE FROM categories
       WHERE id = $1
         AND user_id = $2`,
      [id, userId]
    );

    return rowCount > 0;
  }
};

module.exports = CategoryModel;