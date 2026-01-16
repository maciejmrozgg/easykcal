const API_BASE = import.meta.env.VITE_API_URL + "/api/schedule";

const handleResponse = async (res, errorMsg) => {
  if (!res.ok) throw new Error(errorMsg);
  return res.json();
};

const scheduleApi = {
  getMonth: (year, month) =>
    fetch(`${API_BASE}/${year}/${month}`, {
      credentials: "include",
    }).then(res => handleResponse(res, "Failed to fetch schedule")),

  updateLimits: (year, month, deficitLimit, zeroLimit) =>
    fetch(`${API_BASE}/${year}/${month}/limits`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ deficitLimit, zeroLimit }),
    }).then(res => handleResponse(res, "Failed to update limits")),

  addMeal: (year, month, name) =>
    fetch(`${API_BASE}/${year}/${month}/meal`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ name }),
    }).then(res => handleResponse(res, "Failed to add meal")),

  updateMealName: (year, month, mealId, name) =>
    fetch(`${API_BASE}/${year}/${month}/meal/${mealId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ name }),
    }).then(res => handleResponse(res, "Failed to rename meal")),

  deleteMeal: (year, month, mealId) =>
    fetch(`${API_BASE}/${year}/${month}/meal/${mealId}`, {
      method: "DELETE",
      credentials: "include",
    }).then(res => handleResponse(res, "Failed to delete meal")),

  addIngredient: (year, month, date, ingredient) =>
    fetch(`${API_BASE}/${year}/${month}/day/${date}/ingredient`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(ingredient),
    }).then(res => handleResponse(res, "Failed to add ingredient")),

  updateIngredient: (year, month, date, ingredientIndex, ingredient) =>
    fetch(`${API_BASE}/${year}/${month}/day/${date}/ingredient/${ingredientIndex}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(ingredient),
    }).then(res => handleResponse(res, "Failed to update ingredient")),

  deleteIngredient: (year, month, date, ingredientIndex, mealId) =>
    fetch(`${API_BASE}/${year}/${month}/day/${date}/ingredient/${ingredientIndex}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ mealId }),
    }).then(res => handleResponse(res, "Failed to delete ingredient")),
};

export default scheduleApi;