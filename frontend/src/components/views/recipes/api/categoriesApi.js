const API_URL = import.meta.env.VITE_API_URL;

export const getCategories = async () => {
  const res = await fetch(`${API_URL}/api/categories`, {
    credentials: "include",
  });

  if (!res.ok) throw new Error("Failed to fetch categories");

  return res.json();
};

export const createCategory = async (name) => {
  const res = await fetch(`${API_URL}/api/categories`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ name }),
  });

  if (!res.ok) throw new Error("Failed to create category");

  return res.json();
};

export const updateCategory = async (id, name) => {
  const res = await fetch(`${API_URL}/api/categories/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ name }),
  });

  if (!res.ok) throw new Error("Failed to update category");

  return res.json();
};

export const deleteCategory = async (id) => {
  const res = await fetch(`${API_URL}/api/categories/${id}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!res.ok) throw new Error("Failed to delete category");

  return res.json();
};