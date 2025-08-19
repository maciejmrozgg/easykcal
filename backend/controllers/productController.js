const productModel = require('../models/productModel');

exports.getAllProducts = async (req, res) => {
  const search = req.query.search;
  try {
    const products = await productModel.getProducts(search);
    res.json(products);
  } catch (err) {
    console.error('❌ Błąd pobierania produktów:', err);
    res.status(500).json({ error: 'Błąd serwera przy pobieraniu produktów' });
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
    console.error('❌ Błąd zapisu produktu:', err);
    res.status(500).json({ error: 'Błąd serwera przy zapisie produktu' });
  }
};
