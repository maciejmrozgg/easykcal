const express = require('express');
const router = express.Router();
const calculatorController = require('../controllers/calculatorController');

router.post('/calculate', calculatorController.calculateCalories);
router.post('/calculate-reverse', calculatorController.calculateReverse);

module.exports = router;