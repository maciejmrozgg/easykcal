const RecipeModel = require("../models/recipeModel");
const pool = require("../config/db");

const safeParseJSON = (str) => {
  if (!str) return [];
  try {
    return JSON.parse(str);
  } catch (e) {
    // jeśli nie JSON, traktujemy całość jako jeden element tablicy
    return [str];
  }
};

exports.getAllRecipes = async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM recipes ORDER BY id");

    const recipes = rows.map(r => ({
      ...r,
      ingredients: safeParseJSON(r.ingredients),
      instructions: safeParseJSON(r.instructions),
    }));

    res.json(recipes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Błąd pobierania przepisów" });
  }
};

exports.getRecipe = async (req, res) => {
    try {
        const userId = req.user.id;
        const recipeId = req.params.id;

        const recipe = await RecipeModel.getById(recipeId, userId);
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
      return res.status(400).json({ error: "Title, ingredients and instructions are required" });
    }

    const recipe = await RecipeModel.create(userId, { title, description, ingredients, instructions, imageName });
    res.status(201).json(recipe);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create recipe" });
  }
};

exports.deleteRecipe = async (req, res) => {
    try {
        const userId = req.user.id;
        const recipeId = req.params.id;

        const deleted = await RecipeModel.delete(recipeId, userId);
        if (!deleted) {
            return res.status(404).json({ error: "Recipe not found" });
        }

        res.json({ message: "Recipe deleted" });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete recipe" });
    }
};