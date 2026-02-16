const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const categoryController = require("../controllers/categoryController");

router.get("/", authMiddleware, categoryController.getCategories);

module.exports = router;