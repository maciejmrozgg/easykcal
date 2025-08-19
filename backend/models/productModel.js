const pool = require('../config/db');

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

exports.insertProduct = async (name, kcalPer100g) => {
  const result = await pool.query(
    'INSERT INTO products (name, kcal_per_100g) VALUES ($1, $2) RETURNING *',
    [name, kcalPer100g]
  );
  return result.rows[0];
};
