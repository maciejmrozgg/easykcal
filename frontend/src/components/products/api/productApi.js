const API_URL = import.meta.env.VITE_API_URL;
//GET
export async function fetchProducts(query = '') {
  try {
    const url = query
      ? `${API_URL}/products?search=${encodeURIComponent(query)}`
      : `${API_URL}/products`;
    const res = await fetch(url);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Błąd pobierania produktów');
    return data;
  } catch (err) {
    throw new Error(err.message || 'Błąd pobierania produktów');
  }
}
//POST
export async function addProduct({ name, kcalPer100g }) {
  try {
    const res = await fetch(`${API_URL}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, kcalPer100g: Number(kcalPer100g) }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Błąd dodawania produktu');
    return data;
  } catch (err) {
    throw new Error(err.message || 'Błąd dodawania produktu');
  }
}
//DELETE
export async function deleteProduct(id) {
  try {
    const res = await fetch(`${API_URL}/products/${id}`, {
      method: 'DELETE',
      credentials: "include",
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Błąd usuwania produktu');
    return data;
  } catch (err) {
    throw new Error(err.message || 'Błąd usuwania produktu');
  }
}
//PUT
export async function updateProduct(id, {name, kcalPer100g}) {
  try {
    const res = await fetch(`${API_URL}/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, kcalPer100g: Number(kcalPer100g) }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Błąd aktualizacji produktu');
    return data;
  } catch (err) {
    throw new Error(err.message || 'Błąd aktualizacji produktu');
  }
}