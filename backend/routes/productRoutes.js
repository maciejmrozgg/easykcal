const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const authMiddleware = require('../middleware/authMiddleware');

// CRUD
router.get('/', productController.getAllProducts);
router.post('/', authMiddleware, productController.addProduct);
router.delete('/:id', authMiddleware, productController.deleteOneProduct);
router.put('/:id', authMiddleware, productController.updateOneProduct);

module.exports = router;
