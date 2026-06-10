import React, { useState } from 'react';

export default function ProductForm({ onAdd }) {
  const [name, setName] = useState('');
  const [kcalPer100g, setKcalPer100g] = useState('');
  const [fatPer100g, setFatPer100g] = useState('');
  const [proteinPer100g, setProteinPer100g] = useState('');
  const [carbsPer100g, setCarbsPer100g] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onAdd({ name, kcalPer100g, fatPer100g, proteinPer100g, carbsPer100g });
    setName('');
    setKcalPer100g('');
    setFatPer100g('');
    setProteinPer100g('');
    setCarbsPer100g('');
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
      <input
        type="number"
        placeholder="Białko na 100g"
        value={proteinPer100g}
        onChange={e => setProteinPer100g(e.target.value)}
      />
      <input
        type="number"
        placeholder="Tłuszcze na 100g"
        value={fatPer100g}
        onChange={e => setFatPer100g(e.target.value)}
      />
      <input
        type="number"
        placeholder="Węglowodany na 100g"
        value={carbsPer100g}
        onChange={e => setCarbsPer100g(e.target.value)}
      />
      <button type="submit">Dodaj produkt</button>
    </form>
  );
}