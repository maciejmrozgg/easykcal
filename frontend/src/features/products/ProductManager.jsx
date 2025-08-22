import { useState } from 'react';
import './ProductManager.css';
import { useProducts } from './ProductsContext';

export default function ProductManager() {
  const { products, error, addProduct, deleteProduct, updateProduct, loadProducts } = useProducts();

  const [name, setName] = useState('');
  const [kcalPer100g, setKcalPer100g] = useState('');
  const [search, setSearch] = useState('');
  const [visibleCount, setVisibleCount] = useState(10);

  const handleAddProduct = async (e) => {
    e.preventDefault();
    await addProduct({ name, kcalPer100g });
    setName('');
    setKcalPer100g('');
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm('Czy na pewno chcesz usunąć produkt?')) {
      await deleteProduct(id);
    }
  };

  const handleEditProduct = async (p) => {
    const newName = window.prompt('Nowa nazwa produktu:', p.name);
    const newKcal = window.prompt('Nowa wartość kcal/100g:', p.kcal_per_100g);

    if (!newName || !newKcal) return;

    await updateProduct(p.id, { name: newName, kcalPer100g: newKcal });
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
                <button className='delbtn' onClick={() => handleDeleteProduct(p.id)}>🗑️ DELETE</button>
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