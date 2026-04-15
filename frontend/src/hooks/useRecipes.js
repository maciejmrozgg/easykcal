import { useState, useEffect } from "react";
import { getRecipes, createRecipe, updateRecipe, deleteRecipe } from "../components/views/recipes/api/recipesApi";
import { getCategories, createCategory, updateCategory, deleteCategory } from "../components/views/recipes/api/categoriesApi";

const useRecipes = () => {
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

  return {
    recipes,
    categories,
    addRecipe,
    editRecipe,
    removeRecipe,
    addCategory,
    editCategory,
    removeCategory
  };
};

export default useRecipes;