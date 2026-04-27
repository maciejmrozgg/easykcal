import type { Recipe } from "../../../../types/recipe";

const API_URL = import.meta.env.VITE_API_URL;

export const getRecipes = async (): Promise<Recipe[]> => {
  const res = await fetch(`${API_URL}/api/recipes`, {
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to fetch recipes");
  return res.json();
};

export const createRecipe = async (data: Recipe) => {
  const res = await fetch(`${API_URL}/api/recipes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create recipe");
  return res.json();
};

export const updateRecipe = async (id: number, data: Recipe) => {
  const res = await fetch(`${API_URL}/api/recipes/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update recipe");
  return res.json();
};

export const deleteRecipe = async (id: number) => {
  const res = await fetch(`${API_URL}/api/recipes/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to delete recipe");
  return res.json();
};