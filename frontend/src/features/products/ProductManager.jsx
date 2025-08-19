import { useState, useEffect } from 'react';
import './ProductManager.css';
import { fetchProducts, addProduct as addProductApi, deleteProduct as deleteProductApi, updateProduct as updateProductApi } from './productApi';

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
      setProducts(prev => [newProduct, ...prev]);
      setName('');
      setKcalPer100g('');

    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteProduct = async (id) => {
    setError('');
    try {
      await deleteProductApi(id);
      setProducts(prev => prev.filter(p => p.id !== id));
    } catch(err) {
      setError(err.message);
    }
  }

  const handleEditProduct = async (p) => {
  const newName = window.prompt('Nowa nazwa produktu:', p.name);
  const newKcal = window.prompt('Nowa wartość kcal/100g:', p.kcal_per_100g);

  if (!newName || !newKcal) return;

  try {
    const updated = await updateProductApi(p.id, { name: newName, kcalPer100g: newKcal });
    setProducts(prev => prev.map(prod => prod.id === p.id ? updated : prod));
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
        {products.slice(0, visibleCount).map(p => 
          <li key={p.id}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>{p.name} - {p.kcal_per_100g} kcal</span>
              <span>
                <button className='editbtn' onClick={() => handleEditProduct(p)}>✏️ EDIT</button>
                <button className='delbtn' onClick={() => {
                  if(window.confirm(`Czy napewno chcesz usunąć produkt "${p.name}"?`)) {
                    handleDeleteProduct(p.id);
                  }
                }}>🗑️ DELETE</button>
              </span>
            </div>
          </li>
        )}
      </ol>

      {visibleCount < products.length && <button className='pm-button' onClick={() => setVisibleCount(Math.min(visibleCount + 10, products.length))}>Pokaż więcej</button>}
      {visibleCount > 10 && <button className='pm-button' onClick={() => setVisibleCount(Math.max(visibleCount - 10, 10))}>Pokaż mniej</button>}
      {visibleCount < products.length && <button className='pm-button' onClick={() => setVisibleCount(products.length)}>Pokaż wszystkie</button>}
    </div>
  );
}