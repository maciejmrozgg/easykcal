const CategoryModel = require("../models/categoryModel");

exports.getCategories = async (req, res) => {
  try {
    const userId = req.user.id;

    const categories = await CategoryModel.getAllForUser(userId);

    res.json(categories);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch categories" });
  }
};

exports.createCategory = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name } = req.body;

    if (!name?.trim()) {
      return res.status(400).json({ error: "Name is required" });
    }

    const category = await CategoryModel.create(userId, name.trim());

    res.status(201).json(category);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create category" });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { name } = req.body;

    if (!name?.trim()) {
      return res.status(400).json({ error: "Name is required" });
    }

    const updated = await CategoryModel.update(id, userId, name.trim());

    if (!updated) {
      return res.status(403).json({ error: "Forbidden" });
    }

    res.json(updated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update category" });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const deleted = await CategoryModel.delete(id, userId);

    if (!deleted) {
      return res.status(403).json({ error: "Forbidden" });
    }

    res.json({ message: "Category deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete category" });
  }
};