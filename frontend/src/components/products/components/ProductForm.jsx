import React, { useState } from 'react';

export default function ProductForm({ onAdd }) {
  const [name, setName] = useState('');
  const [kcalPer100g, setKcalPer100g] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onAdd({ name, kcalPer100g });
    setName('');
    setKcalPer100g('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Nazwa produktu"
        value={name}
        onChange={e => setName(e.target.value)}
        required
      />
      <input
        type="number"
        placeholder="Kalorie na 100g"
        value={kcalPer100g}
        onChange={e => setKcalPer100g(e.target.value)}
        required
      />
      <button type="submit">Dodaj produkt</button>
    </form>
  );
}