const pool = require('../config/db');

//GET
exports.getProducts = async (search) => {
  let result;
  if (search) {
    result = await pool.query(
      'SELECT * FROM products WHERE name ILIKE $1 ORDER BY id ASC',
      [`%${search}%`]
    );
  } else {
    result = await pool.query('SELECT * FROM products ORDER BY id ASC');
  }

  return result.rows.map(p => ({
    id: p.id,
    name: p.name,
    kcalPer100g: p.kcal_per_100g, //conversion snake_case -> camelCase
    fatPer100g: p.fat_per_100g,
    proteinPer100g: p.protein_per_100g,
    carbsPer100g: p.carbs_per_100g
  }));
};

//POST
exports.insertProduct = async (name, kcal, fat, protein, carbs) => {
  const result = await pool.query(
    'INSERT INTO products (name, kcal_per_100g, fat_per_100g, protein_per_100g, carbs_per_100g) VALUES ($1, $2, $3, $4, $5) RETURNING *',
    [name, kcal, fat, protein, carbs]
  );

  return {
    id: result.rows[0].id,
    name: result.rows[0].name,
    kcalPer100g: result.rows[0].kcal_per_100g, //conversion snake_case -> camelCase
    fatPer100g: result.rows[0].fat_per_100g,
    proteinPer100g: result.rows[0].protein_per_100g,
    carbsPer100g: result.rows[0].carbs_per_100g
  };
};

//DELETE
exports.deleteProduct = async (id) => {
  const result = await pool.query(
    'DELETE FROM products WHERE id = $1 RETURNING *',
    [id]
  );

  return {
    id: result.rows[0].id,
    name: result.rows[0].name,
    kcalPer100g: result.rows[0].kcal_per_100g, //conversion snake_case -> camelCase
    fatPer100g: result.rows[0].fat_per_100g,
    proteinPer100g: result.rows[0].protein_per_100g,
    carbsPer100g: result.rows[0].carbs_per_100g
  };
}

//PUT
exports.updateProduct = async (id, name, kcal, fat, protein, carbs) => {

  const result = await pool.query(
    'UPDATE products SET name = $1, kcal_per_100g = $2, fat_per_100g = $3, protein_per_100g = $4, carbs_per_100g = $5 WHERE id = $6 RETURNING *',
    [name, kcal, fat, protein, carbs, id]
  );

  return {
    id: result.rows[0].id,
    name: result.rows[0].name,
    kcalPer100g: result.rows[0].kcal_per_100g, //conversion snake_case -> camelCase
    fatPer100g: result.rows[0].fat_per_100g,
    proteinPer100g: result.rows[0].protein_per_100g,
    carbsPer100g: result.rows[0].carbs_per_100g
  };
};