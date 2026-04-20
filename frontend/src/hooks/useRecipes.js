import { useState, useEffect } from "react";
import { getRecipes, createRecipe, updateRecipe, deleteRecipe } from "../components/views/recipes/api/recipesApi";
import { getCategories, createCategory, updateCategory, deleteCategory } from "../components/views/recipes/api/categoriesApi";

const useRecipes = (filter = "") => {
  const [recipes, setRecipes] = useState([]);
  const [categories, setCategories] = useState([]);

  const fetchData = async () => {
    const recipesData = await getRecipes();
    const categoriesData = await getCategories();

    setRecipes(recipesData);
    setCategories(categoriesData);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ✅ RECIPE CRUD

  const addRecipe = async (data) => {
    await createRecipe(data);
    await fetchData();
  };

  const editRecipe = async (id, data) => {
    await updateRecipe(id, data);
    await fetchData();
  };

  const removeRecipe = async (id) => {
    await deleteRecipe(id);
    await fetchData();
  };

  // ✅ CATEGORY CRUD

  const addCategory = async (name) => {
    await createCategory(name);
    await fetchData();
  };

  const editCategory = async (id, name) => {
    await updateCategory(id, name);
    await fetchData();
  };

  const removeCategory = async (id) => {
    await deleteCategory(id);
    await fetchData();
  };

  const filteredRecipes = recipes.filter(recipe =>
    recipe.title.toLowerCase().includes(filter.toLowerCase())
  );

  const groupedRecipes = filteredRecipes.reduce((acc, recipe) => {
    const category = recipe.category_name || "Bez kategorii";
    if (!acc[category]) acc[category] = [];
    acc[category].push(recipe);
    return acc;
  }, {});

  // Add virtual "Bez kategorii" tile if needed
  const categoriesToDisplay = [
    ...categories,
    ...(groupedRecipes["Bez kategorii"]
      ? [{ id: "no-category", name: "Bez kategorii", image_url: null }]
      : [])
  ];

  return {
    filteredRecipes,
    groupedRecipes,
    categoriesToDisplay,
    addRecipe,
    editRecipe,
    removeRecipe,
    addCategory,
    editCategory,
    removeCategory
  };
};

export default useRecipes;