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