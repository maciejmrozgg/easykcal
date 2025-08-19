const pool = require('../config/db');

//GET
exports.getProducts = async (search) => {
  if (search) {
    const result = await pool.query(
      'SELECT * FROM products WHERE name ILIKE $1 ORDER BY id ASC',
      [`%${search}%`]
    );
    return result.rows;
  } else {
    const result = await pool.query('SELECT * FROM products ORDER BY id ASC');
    return result.rows;
  }
};

//POST
exports.insertProduct = async (name, kcalPer100g) => {
  const result = await pool.query(
    'INSERT INTO products (name, kcal_per_100g) VALUES ($1, $2) RETURNING *',
    [name, kcalPer100g]
  );
  return result.rows[0];
};

//DELETE
exports.deleteProduct = async (id) => {
  const result = await pool.query(
    'DELETE FROM products WHERE id = $1 RETURNING *',
    [id]
  );
  return result.rows[0];
}

//PUT
exports.updateProduct = async (id, newData) => {
  const { name, kcalPer100g } = newData;
  const kcal = Number(newData.kcalPer100g ?? newData.kcal_per_100g);

  if (isNaN(kcal)) {
    throw new Error('Nieprawidłowa wartość kalorii');
  }

  const result = await pool.query(
    'UPDATE products SET name = $1, kcal_per_100g = $2 WHERE id = $3 RETURNING *',
    [name, kcal, id]
  );
  return result.rows[0];
};