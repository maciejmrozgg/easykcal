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

exports.addProduct = async (req, res) => {
  const { name, kcalPer100g } = req.body;
  if (!name || !kcalPer100g) {
    return res.status(400).json({ error: 'Brakuje danych produktu' });
  }
  try {
    const newProduct = await productModel.insertProduct(name, kcalPer100g);
    res.status(201).json(newProduct);
  } catch (err) {
    next(err);
  }
};

exports.deleteOneProduct = async (req,res, next) => {
  try {
  const id = req.params.id;
  const removedProduct = await productModel.deleteProduct(id);

  if(!removedProduct) {
    return res.status(404).json({ error: 'Produkt nie istnieje' });
  } 

    res.status(200).json(removedProduct);
  } catch(err) {
    next(err);
  }
};