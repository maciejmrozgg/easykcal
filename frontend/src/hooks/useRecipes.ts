import { useState, useEffect } from "react";
import { getRecipes, createRecipe, updateRecipe, deleteRecipe } from "../components/views/recipes/api/recipesApi";
import { getCategories, createCategory, updateCategory, deleteCategory } from "../components/views/recipes/api/categoriesApi";
import type { Recipe } from "../types/recipe";
import type { Category } from "../types/category";

const useRecipes = (filter = "") => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

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
  const addRecipe = async (data: Recipe) => {
    await createRecipe(data);
    await fetchData();
  };

  const editRecipe = async (id: number, data: Recipe) => {
    await updateRecipe(id, data);
    await fetchData();
  };

  const removeRecipe = async (id: number) => {
    await deleteRecipe(id);
    await fetchData();
  };

  // ✅ CATEGORY CRUD
  const addCategory = async (name: string) => {
    await createCategory(name);
    await fetchData();
  };

  const editCategory = async (id: number, name: string) => {
    await updateCategory(id, name);
    await fetchData();
  };

  const removeCategory = async (id: number) => {
    await deleteCategory(id);
    await fetchData();
  };

  const filteredRecipes = recipes.filter(recipe =>
    recipe.title.toLowerCase().includes(filter.toLowerCase())
  );

  const groupedRecipes = filteredRecipes.reduce<Record<string, Recipe[]>>(
    (acc, recipe) => {
      const category = recipe.category_name || "Bez kategorii";

      if (!acc[category]) acc[category] = [];
      acc[category].push(recipe);
      return acc;
    }, {});

  // Add virtual "Bez kategorii" tile if needed
  const hasUncategorizedCategory = categories.some(
    category => category.name === "Bez kategorii"
  );

  const categoriesToDisplay = [
    ...categories,
    ...(groupedRecipes["Bez kategorii"] && !hasUncategorizedCategory
      ? [{ id: -1, name: "Bez kategorii", image_url: null }]
      : []
    )
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