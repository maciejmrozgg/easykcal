const pool = require("../config/db");

const parseJSON = (value) => {
  if (!value) return [];
  if (typeof value === "object") return value;
  try {
    return JSON.parse(value);
  } catch {
    return [];
  }
};

const mapRecipe = (row) => ({
  ...row,
  ingredients: parseJSON(row.ingredients),
  instructions: parseJSON(row.instructions),
});

const RecipeModel = {
  async getAll() {
    const { rows } = await pool.query(
      `SELECT * FROM recipes ORDER BY created_at`
    );
    return rows.map(mapRecipe);
  },

  async getById(id) {
    const { rows } = await pool.query(
      `SELECT * FROM recipes WHERE id = $1`,
      [id]
    );
    return rows[0] ? mapRecipe(rows[0]) : null;
  },

  async create(userId, { title, description, ingredients, instructions, imageName }) {
    const { rows } = await pool.query(
      `INSERT INTO recipes (user_id, title, description, ingredients, instructions, image_name)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [
        userId,
        title,
        description,
        JSON.stringify(ingredients),
        JSON.stringify(instructions),
        imageName || null,
      ]
    );
    return mapRecipe(rows[0]);
  },

  async update(id, { title, description, ingredients, instructions, imageName }) {
  const { rows } = await pool.query(
    `UPDATE recipes
     SET title = $1,
         description = $2,
         ingredients = $3,
         instructions = $4,
         image_name = $5
     WHERE id = $6
     RETURNING *`,
    [
      title,
      description,
      JSON.stringify(ingredients),
      JSON.stringify(instructions),
      imageName || null,
      id,
    ]
  );

  return rows[0] ? mapRecipe(rows[0]) : null;
},

  async delete(id) {
    const result = await pool.query(
      `DELETE FROM recipes WHERE id = $1`,
      [id]
    );
    return result.rowCount > 0;
  },
};

module.exports = RecipeModel;