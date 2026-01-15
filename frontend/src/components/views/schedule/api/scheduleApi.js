const API_BASE = import.meta.env.VITE_API_URL + '/api/schedule';

const scheduleApi = {
  getMonth: async (year, month) => {
    const res = await fetch(`${API_BASE}/${year}/${month}`, {
      credentials: "include",
    });
    if (!res.ok) throw new Error("Failed to fetch schedule");
    return res.json();
  },

  updateLimits: async (year, month, deficitLimit, zeroLimit) => {
  const res = await fetch(`${API_BASE}/${year}/${month}/limits`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ deficitLimit, zeroLimit }),
  });
  if (!res.ok) throw new Error("Failed to update limits");
  return res.json();
},

  addMeal: async (year, month, name) => {
    const res = await fetch(`${API_BASE}/${year}/${month}/meal`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ name }),
    });
    if (!res.ok) throw new Error("Failed to add meal");
    return res.json();
  },

  updateMealName: async (year, month, mealId, name) => {
    const res = await fetch(`${API_BASE}/${year}/${month}/meal/${mealId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ name }),
    });
    if (!res.ok) throw new Error("Failed to rename meal");
    return res.json();
  },

  deleteMeal: async (year, month, mealId) => {
    const res = await fetch(`${API_BASE}/${year}/${month}/meal/${mealId}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (!res.ok) throw new Error("Failed to delete meal");
    return res.json();
  },

  addIngredient: async (year, month, date, ingredient) => {
  const res = await fetch(`${API_BASE}/${year}/${month}/day/${date}/ingredient`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(ingredient),
  });
  if (!res.ok) throw new Error("Failed to add ingredient");
  return res.json();
},


  updateIngredient: async (year, month, date, ingredientIndex, ingredient) => {
    const res = await fetch(`${API_BASE}/${year}/${month}/day/${date}/ingredient/${ingredientIndex}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(ingredient),
    });
    if (!res.ok) throw new Error("Failed to update ingredient");
    return res.json();
  },

  deleteIngredient: async (year, month, date, ingredientIndex, mealId) => {
    const res = await fetch(`${API_BASE}/${year}/${month}/day/${date}/ingredient/${ingredientIndex}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ mealId })
    });
    if (!res.ok) throw new Error("Failed to delete ingredient");
    return res.json();
  },
};

export default scheduleApi;
