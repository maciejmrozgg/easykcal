const pool = require('../config/db');

//GET
exports.getProducts = async (search) => {
  let result;
  if (search) {
    const result = await pool.query(
      'SELECT * FROM products WHERE name ILIKE $1 ORDER BY id ASC',
      [`%${search}%`]
    );
  } else {
    result = await pool.query('SELECT * FROM products ORDER BY id ASC');
  }

    return result.rows.map(p => ({
      id: p.id,
      name: p.name,
      kcalPer100g: p.kcal_per_100g, //conversion snake -> camel
    }));
  };

//POST
exports.insertProduct = async (name, kcalPer100g) => {
  const result = await pool.query(
    'INSERT INTO products (name, kcal_per_100g) VALUES ($1, $2) RETURNING *',
    [name, kcalPer100g]
  );

  return {
    id: result.rows[0].id,
    name: result.rows[0].name,
    kcalPer100g: result.rows[0].kcal_per_100g, //conversion snake -> camel
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
    kcalPer100g: result.rows[0].kcal_per_100g, //conversion snake -> camel
  };
}

//PUT
exports.updateProduct = async (id, newData) => {
  const { name, kcalPer100g } = newData;
  const kcal = Number(kcalPer100g);

  if (isNaN(kcal)) {
    throw new Error('Nieprawidłowa wartość kalorii');
  }

  const result = await pool.query(
    'UPDATE products SET name = $1, kcal_per_100g = $2 WHERE id = $3 RETURNING *',
    [name, kcal, id]
  );
  
   return {
    id: result.rows[0].id,
    name: result.rows[0].name,
    kcalPer100g: result.rows[0].kcal_per_100g, //conversion snake -> camel
  };
};