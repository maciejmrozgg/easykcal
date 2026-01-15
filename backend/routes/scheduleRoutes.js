const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const controller = require("../controllers/scheduleController");

router.use(authMiddleware);

// GET full month schedule
router.get("/:year/:month", controller.getMonthlySchedule);

// Monthly limit
router.patch("/:year/:month/limits", controller.updateMonthlyLimits);

// Meals CRUD
router.post("/:year/:month/meal", controller.addMeal);
router.patch("/:year/:month/meal/:mealId", controller.updateMealName);
router.delete("/:year/:month/meal/:mealId", controller.deleteMeal);

// Ingredients CRUD
router.post("/:year/:month/day/:date/ingredient", controller.addIngredient);
router.patch("/:year/:month/day/:date/ingredient/:ingredientIndex", controller.updateIngredient);
router.delete("/:year/:month/day/:date/ingredient/:ingredientIndex", controller.deleteIngredient);

module.exports = router;