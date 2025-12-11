const API_URL = import.meta.env.VITE_API_URL;

export const getRecipes = async () => {
  const res = await fetch(`${API_URL}/api/recipes`, {
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to fetch recipes");
  return res.json();
};

export const createRecipe = async (recipe) => {
  const res = await fetch(`${API_URL}/api/recipes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(recipe),
  });
  if (!res.ok) throw new Error("Failed to create recipe");
  return res.json();
};