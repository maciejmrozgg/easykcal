const errorHandler = require('../middleware/errorHandler');
const productModel = require('../models/productModel');

exports.getAllProducts = async (req, res, next) => {
  const search = req.query.search;
  try {
    const products = await productModel.getProducts(search);
    res.json(products);
  } catch (err) {
    next(err);
  }
};

exports.addProduct = async (req, res, next) => {
  const { name, kcalPer100g, fatPer100g, proteinPer100g, carbsPer100g } = req.body;

  const kcal = Number(kcalPer100g);
  const fat = fatPer100g === "" || fatPer100g === undefined ? null : Number(fatPer100g);
  const protein = proteinPer100g === "" || proteinPer100g === undefined ? null : Number(proteinPer100g);
  const carbs = carbsPer100g === "" || carbsPer100g === undefined ? null : Number(carbsPer100g);

  if (!name || isNaN(kcal)) {
    return res.status(400).json({ error: 'Brakuje nazwy lub kaloryczności produktu' });
  }

  const values = [kcal, fat, protein, carbs];

  if (values.some(value => isNaN(value))) {
    return res.status(400).json({
      error: "Wartości muszą być liczbami"
    });
  }

  try {
    const newProduct = await productModel.insertProduct(name, kcal, fat, protein, carbs);
    res.status(201).json(newProduct);
  } catch (err) {
    next(err);
  }
};

exports.deleteOneProduct = async (req, res, next) => {
  try {
    const id = req.params.id;
    const removedProduct = await productModel.deleteProduct(id);

    if (!removedProduct) {
      return res.status(404).json({ error: 'Produkt nie istnieje' });
    }

    res.status(200).json(removedProduct);
  } catch (err) {
    next(err);
  }
};

exports.updateOneProduct = async (req, res, next) => {
  const id = req.params.id;
  const { name, kcalPer100g, fatPer100g, proteinPer100g, carbsPer100g } = req.body;

  const kcal = Number(kcalPer100g);
  const fat = fatPer100g === "" || fatPer100g === undefined ? null : Number(fatPer100g);
  const protein = proteinPer100g === "" || proteinPer100g === undefined ? null : Number(proteinPer100g);
  const carbs = carbsPer100g === "" || carbsPer100g === undefined ? null : Number(carbsPer100g);

  const values = [kcal, fat, protein, carbs];

  if (values.some(value => isNaN(value))) {
    return res.status(400).json({
      error: "Wartości muszą być liczbami"
    });
  }

  try {
    const updatedProduct = await productModel.updateProduct(id, name, kcal, fat, protein, carbs);

    if (!updatedProduct) {
      return res.status(404).json({
        error: 'Produkt nie istnieje'
      });
    }

    res.json(updatedProduct);
  } catch (err) {
    next(err);
  }
};