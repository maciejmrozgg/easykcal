const RecipeModel = require("../models/recipeModel");

exports.getAllRecipes = async (req, res) => {
    try {
        const userId = req.user.id;
        const recipes = await RecipeModel.getAllByUser(userId);
        res.json(recipes);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch recipes" });
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
        const { title, description } = req.body;

        if (!title) {
            return res.status(400).json({ error: "Title is required" });
        }

        const recipe = await RecipeModel.create(userId, title, description);
        res.status(201).json(recipe);
    } catch (error) {
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