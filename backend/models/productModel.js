const pool = require('../config/db');

// Transform database row into a product object with camelCase properties
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
exports.insertProduct = async (userId, name, kcal, fat, protein, carbs) => {
  const result = await pool.query(
    'INSERT INTO products (user_id, name, kcal_per_100g, fat_per_100g, protein_per_100g, carbs_per_100g) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
    [userId, name, kcal, fat, protein, carbs]
  );

  return mapProduct(result.rows[0]);
};

//DELETE
exports.deleteProduct = async (id, userId, userRole) => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Check if product exists
    const product = await client.query(
      'SELECT * FROM products WHERE id = $1 FOR UPDATE',
      [id]
    );

    if (product.rows.length === 0) {
      await client.query('ROLLBACK');
      return { status: 'not_found' };
    }

    // Check permissions
    const isOwner = product.rows[0].user_id === userId;
    const isAdmin = userRole === 'admin';

    if (!isOwner && !isAdmin) {
      await client.query('ROLLBACK');
      return { status: 'forbidden' };
    }

    // Delete product
    const result = await client.query(
      'DELETE FROM products WHERE id = $1 RETURNING *',
      [id]
    );

    await client.query('COMMIT');

    return {
      status: 'deleted',
      product: mapProduct(result.rows[0])
    };
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
};

//PUT
exports.updateProduct = async (id, userId, userRole, name, kcal, fat, protein, carbs) => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Check if product exists
    const product = await client.query(
      'SELECT * FROM products WHERE id = $1 FOR UPDATE',
      [id]
    );

    if (product.rows.length === 0) {
      await client.query('ROLLBACK');
      return { status: 'not_found' };
    }

    // Check permissons
    const isOwner = product.rows[0].user_id === userId;
    const isAdmin = userRole === 'admin';

    if (!isOwner && !isAdmin) {
      await client.query('ROLLBACK');
      return { status: 'forbidden' };
    }

    // Update product
    const result = await client.query(
      'UPDATE products SET name = $2, kcal_per_100g = $3, fat_per_100g = $4, protein_per_100g = $5, carbs_per_100g = $6 WHERE id = $1 RETURNING *',
      [id, name, kcal, fat, protein, carbs]
    );

    await client.query('COMMIT');

    return {
      status: 'updated',
      product: mapProduct(result.rows[0])
    };
  } catch (err) {
    await client.query('ROLLBACK');
    throw err
  } finally {
    client.release();
  }
};