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
      `SELECT 
      r.*,
      c.name AS category_name
    FROM recipes r
    LEFT JOIN categories c ON r.category_id = c.id
    ORDER BY r.created_at`
    );
    return rows.map(mapRecipe);
  },

  async getById(id) {
    const { rows } = await pool.query(
      `SELECT 
      r.*,
      c.name AS category_name
    FROM recipes r
    LEFT JOIN categories c ON r.category_id = c.id
    WHERE r.id = $1`,
      [id]
    );
    return rows[0] ? mapRecipe(rows[0]) : null;
  },

  async create(userId, { title, description, ingredients, instructions, imageName, category_id }) {
    const { rows } = await pool.query(
      `INSERT INTO recipes (user_id, title, description, ingredients, instructions, image_name, category_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id`,
      [
        userId,
        title,
        description,
        JSON.stringify(ingredients),
        JSON.stringify(instructions),
        imageName || null,
        category_id ?? null
      ]
    );
    return this.getById(rows[0].id);
  },

  async update(id, { title, description, ingredients, instructions, imageName, category_id }) {
  const { rows } = await pool.query(
    `UPDATE recipes
     SET title = $1,
         description = $2,
         ingredients = $3,
         instructions = $4,
         image_name = $5,
         category_id = $6
     WHERE id = $7
     RETURNING id`,
    [
      title,
      description,
      JSON.stringify(ingredients),
      JSON.stringify(instructions),
      imageName || null,
      category_id ?? null,
      id,
    ]
  );

  return this.getById(id);
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