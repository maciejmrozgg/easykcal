import { useState, useEffect } from 'react';
import './ProductManager.css';
import { fetchProducts, addProduct as addProductApi } from './productApi';

export default function ProductManager() {
  const [products, setProducts] = useState([]);
  const [name, setName] = useState('');
  const [kcalPer100g, setKcalPer100g] = useState('');
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [visibleCount, setVisibleCount] = useState(10);

  const loadProducts = async (query = '') => {
    try {
      const data = await fetchProducts(query);
      setProducts(data);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleAddProduct = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const newProduct = await addProductApi({ name, kcalPer100g });
      setProducts([...products, newProduct]);
      setName('');
      setKcalPer100g('');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);
    loadProducts(value);
  };

  return (
    <div>
      <h2>Zarządzanie produktami</h2>
      <form onSubmit={handleAddProduct}>
        <input type="text" placeholder="Nazwa produktu" value={name} onChange={e => setName(e.target.value)} required />
        <input type="number" placeholder="Kalorie na 100g" value={kcalPer100g} onChange={e => setKcalPer100g(e.target.value)} required />
        <button type="submit">Dodaj produkt</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <h3>Wyszukaj produkt</h3>
      <input type="text" placeholder="Wpisz nazwę..." value={search} onChange={handleSearchChange} />
      <h3>Lista produktów</h3>
      <ol>
        {products.slice(0, visibleCount).map(p => <li key={p.id}>{p.name} - {p.kcal_per_100g} kcal</li>)}
      </ol>
      {visibleCount < products.length && <button className='pm-button' onClick={() => setVisibleCount(Math.min(visibleCount + 10, products.length))}>Pokaż więcej</button>}
      {visibleCount > 10 && <button className='pm-button' onClick={() => setVisibleCount(Math.max(visibleCount - 10, 10))}>Pokaż mniej</button>}
      {visibleCount < products.length && <button className='pm-button' onClick={() => setVisibleCount(products.length)}>Pokaż wszystkie</button>}
    </div>
  );
}