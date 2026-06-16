const pool = require('../config/db');

const mapProduct = (p) => ({
  id: p.id,
  name: p.name,
  kcalPer100g: Number(p.kcal_per_100g),
  fatPer100g: p.fat_per_100g == null ? null : Number(p.fat_per_100g),
  proteinPer100g: p.protein_per_100g == null ? null : Number(p.protein_per_100g),
  carbsPer100g: p.carbs_per_100g == null ? null : Number(p.carbs_per_100g),
});

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

  return result.rows.map(mapProduct);
};

//POST
exports.insertProduct = async (name, kcal, fat, protein, carbs) => {
  const result = await pool.query(
    'INSERT INTO products (name, kcal_per_100g, fat_per_100g, protein_per_100g, carbs_per_100g) VALUES ($1, $2, $3, $4, $5) RETURNING *',
    [name, kcal, fat, protein, carbs]
  );

  return mapProduct(result.rows[0]);
};

//DELETE
exports.deleteProduct = async (id) => {
  const result = await pool.query(
    'DELETE FROM products WHERE id = $1 RETURNING *',
    [id]
  );

  if (result.rows.length === 0) {
    return null;
  }

  return mapProduct(result.rows[0]);
}

//PUT
exports.updateProduct = async (id, name, kcal, fat, protein, carbs) => {

  const result = await pool.query(
    'UPDATE products SET name = $1, kcal_per_100g = $2, fat_per_100g = $3, protein_per_100g = $4, carbs_per_100g = $5 WHERE id = $6 RETURNING *',
    [name, kcal, fat, protein, carbs, id]
  );

  if (result.rows.length === 0) {
    return null;
  }

  return mapProduct(result.rows[0]);
};