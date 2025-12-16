const RecipeModel = require("../models/recipeModel");

exports.getAllRecipes = async (req, res) => {
  try {
    const recipes = await RecipeModel.getAll();
    res.json(recipes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Błąd pobierania przepisów" });
  }
};

exports.getRecipe = async (req, res) => {
  try {
    const recipe = await RecipeModel.getById(req.params.id);

    if (!recipe) {
      return res.status(404).json({ error: "Recipe not found" });
    }

    res.json(recipe);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch recipe" });
  }
};

exports.createRecipe = async (req, res) => {
  try {
    const userId = req.user.id;
    const { title, description, ingredients, instructions, imageName } = req.body;

    if (!title || !ingredients || !instructions) {
      return res.status(400).json({
        error: "Title, ingredients and instructions are required",
      });
    }

    const recipe = await RecipeModel.create(userId, {
      title,
      description,
      ingredients,
      instructions,
      imageName,
    });

    res.status(201).json(recipe);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create recipe" });
  }
};

exports.updateRecipe = async (req, res) => {
  try {
    const recipeId = req.params.id;
    const userId = req.user.id;

    const recipe = await RecipeModel.getById(recipeId);

    if (!recipe) {
      return res.status(404).json({ error: "Recipe not found" });
    }

    //Owner or admin can update
    if (recipe.user_id !== userId && req.user.role !== "admin") {
      return res.status(403).json({ error: "Forbidden" });
    }

    const updated = await RecipeModel.update(recipeId, req.body);
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update recipe" });
  }
};

exports.deleteRecipe = async (req, res) => {
  try {
    //only admin
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Admin only" });
    }

    const deleted = await RecipeModel.delete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ error: "Recipe not found" });
    }

    res.json({ message: "Recipe deleted" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete recipe" });
  }
};