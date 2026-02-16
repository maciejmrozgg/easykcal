const API_URL = import.meta.env.VITE_API_URL;

export const getCategories = async () => {
  const res = await fetch(`${API_URL}/api/categories`, {
    credentials: "include",
  });

  if (!res.ok) throw new Error("Failed to fetch categories");

  return res.json();
};