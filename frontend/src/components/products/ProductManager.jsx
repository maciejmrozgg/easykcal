import { useState, useRef } from 'react';
import './styles/ProductManager.css';
import { useProducts } from './hooks/useProducts';

import ProductForm from './components/ProductForm';
import ProductList from './components/ProductList';
import ScrollButtons from './components/ScrollButtons';

export default function ProductManager() {
  const { products, error, addProduct, deleteProduct, updateProduct, loadProducts } = useProducts();
  const [search, setSearch] = useState('');
  const [visibleCount, setVisibleCount] = useState(10);
  const listRef = useRef(null);

  const handleAddProduct = async (product) => {
    await addProduct(product);
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm('Czy na pewno chcesz usunąć produkt?')) {
      await deleteProduct(id);
    }
  };

  const handleEditProduct = async (p) => {
    const newName = window.prompt('Nowa nazwa produktu:', p.name);
    const newKcal = window.prompt('Nowa wartość kcal/100g:', p.kcalPer100g);
    if (!newName || !newKcal) return;
    await updateProduct(p.id, { name: newName, kcalPer100g: newKcal });
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    loadProducts(e.target.value);
  };

  const scrollToTop = () => listRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  const scrollToBottom = () => listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });

  return (
    <div>
      <h2>Zarządzanie produktami</h2>
      <ProductForm onAdd={handleAddProduct} />
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <h3>Wyszukaj produkt</h3>
      <input type="text" placeholder="Wpisz nazwę..." value={search} onChange={handleSearchChange} />

      <h3>Lista produktów</h3>
      <ProductList products={products} visibleCount={visibleCount} onEdit={handleEditProduct} onDelete={handleDeleteProduct} ref={listRef} />

      {visibleCount < products.length && <button className='pm-button' onClick={() => setVisibleCount(Math.min(visibleCount + 10, products.length))}>Pokaż więcej</button>}
      {visibleCount > 10 && <button className='pm-button' onClick={() => setVisibleCount(Math.max(visibleCount - 10, 10))}>Pokaż mniej</button>}
      {visibleCount < products.length && <button className='pm-button' onClick={() => setVisibleCount(products.length)}>Pokaż wszystkie</button>}
      {visibleCount > 10 && <button className='pm-button' onClick={() => setVisibleCount(10)}>Resetuj widok</button>}

      {visibleCount > 10 && <ScrollButtons scrollToTop={scrollToTop} scrollToBottom={scrollToBottom} />}
    </div>
  );
}