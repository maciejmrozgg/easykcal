const API_URL = import.meta.env.VITE_API_URL;

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