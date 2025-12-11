const pool = require("../config/db");

const RecipeModel = {
  async getAllByUser(userId) {
    const { rows } = await pool.query(
      `SELECT * FROM recipes WHERE user_id = $1 ORDER BY created_at DESC`,
      [userId]
    );
    return rows;
  },

  async getById(id, userId) {
    const { rows } = await pool.query(
      `SELECT * FROM recipes WHERE id = $1 AND user_id = $2`,
      [id, userId]
    );
    return rows[0];
  },

  async create(userId, { title, description, ingredients, instructions, imageName }) {
    const { rows } = await pool.query(
      `INSERT INTO recipes (user_id, title, description, ingredients, instructions, image_name)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [userId, title, description, JSON.stringify(ingredients),
      JSON.stringify(instructions), imageName]
    );
    return rows[0];
  },

  async delete(id, userId) {
    await pool.query(
      `DELETE FROM recipes WHERE id = $1 AND user_id = $2`,
      [id, userId]
    );
    return { success: true };
  }
};

module.exports = RecipeModel;