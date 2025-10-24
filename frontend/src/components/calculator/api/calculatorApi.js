const API_URL = import.meta.env.VITE_API_URL;

export async function calculateCalories(kcalPer100g, weight) {
  try {
    const res = await fetch(`${API_URL}/calculator/calculate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        kcalPer100g: Number(kcalPer100g),
        weight: Number(weight),
      }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Błąd kalkulacji');
    return Math.round(data.result * 100) / 100;
  } catch (err) {
    throw new Error(err.message || 'Błąd kalkulacji');
  }
}

export async function calculateReverse(calories, kcalPer100g) {
  try {
    const res = await fetch(`${API_URL}/calculator/calculate-reverse`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        calories: Number(calories),
        kcalPer100g: Number(kcalPer100g),
      }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Błąd kalkulacji odwrotnej');
    return Math.round(data.weight * 100) / 100;
  } catch (err) {
    throw new Error(err.message || 'Błąd kalkulacji odwrotnej');
  }
}