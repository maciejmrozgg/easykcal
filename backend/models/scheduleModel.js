const pool = require("../db");

const ScheduleModel = {
  async getAllByUser(userId) {
    const { rows } = await pool.query(
      `SELECT s.*, r.title AS recipe_title
       FROM schedule s
       LEFT JOIN recipes r ON s.recipe_id = r.id
       WHERE s.user_id = $1
       ORDER BY s.day_of_week, s.meal_name`,
      [userId]
    );
    return rows;
  },

  async create(userId, dayOfWeek, mealName, recipeId) {
    const { rows } = await pool.query(
      `INSERT INTO schedule (user_id, day_of_week, meal_name, recipe_id)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [userId, dayOfWeek, mealName, recipeId || null]
    );
    return rows[0];
  },

  async delete(id, userId) {
    await pool.query(
      `DELETE FROM schedule WHERE id = $1 AND user_id = $2`,
      [id, userId]
    );
    return { success: true };
  }
};

module.exports = ScheduleModel;