const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// CRUD
router.get('/', productController.getAllProducts);
router.post('/', productController.addProduct);
router.delete('/:id', productController.deleteOneProduct);

module.exports = router;
