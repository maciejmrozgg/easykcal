const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const recipeController = require("../controllers/recipeController");

router.get("/", authMiddleware, recipeController.getAllRecipes);
router.get("/:id", authMiddleware, recipeController.getRecipe);
router.post("/", authMiddleware, recipeController.createRecipe);
router.put("/:id", authMiddleware, recipeController.updateRecipe);
router.delete("/:id", authMiddleware, recipeController.deleteRecipe);

module.exports = router;