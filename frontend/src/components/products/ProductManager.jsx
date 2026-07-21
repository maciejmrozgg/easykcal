import { useState, useRef } from 'react';
import './styles/ProductManager.css';
import { useProducts } from './hooks/useProducts';
import { useToast } from '../ui/toast/hooks/useToast';

import ProductForm from './components/ProductForm';
import ProductList from './components/ProductList';
import ScrollButtons from './components/ScrollButtons';
import ProductModal from './components/modals/ProductModal';

export default function ProductManager({ user }) {
  const { products, error, addProduct, deleteProduct, updateProduct, loadProducts } = useProducts();
  const [search, setSearch] = useState('');
  const [visibleCount, setVisibleCount] = useState(10);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const listRef = useRef(null);

  const { showToast } = useToast();

  const handleAddProduct = async (product) => {
    try {
      await addProduct(product);

      showToast(
        `Dodano produkt: ${product.name}`,
        'success'
      );
    } catch {
      showToast(
        'Nie udało się dodać produktu',
        'error'
      );
    }
  };

  const handleDeleteFromModal = async () => {
    if (!editingProduct) return;

    const confirmed = window.confirm(
      `Czy na pewno chcesz usunąć produkt "${editingProduct.name}"?`
    );

    if (!confirmed) return;

    try {
      await deleteProduct(editingProduct.id);

      showToast(
        `Usunięto produkt: ${editingProduct.name}`,
        "info"
      );

      setIsModalOpen(false);
      setEditingProduct(null);
    } catch {
      showToast(
        'Nie udało się usunąć produktu',
        'error'
      );
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleSaveProduct = async (updatedProduct) => {
    try {
      await updateProduct(
        editingProduct.id,
        updatedProduct
      );

      showToast(
        `Zaktualizowano produkt: ${updatedProduct.name}`,
        "success"
      );

      setIsModalOpen(false);
      setEditingProduct(null);
    } catch {
      showToast(
        'Nie udało się zaktualizować produktu',
        'error'
      );
    }
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    loadProducts(e.target.value);
  };

  const scrollToTop = () => listRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  const scrollToBottom = () => listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });

  return (
    <div className="product-manager">
      <h2>Zarządzanie produktami</h2>
      {user && (
        <ProductForm onAdd={handleAddProduct} />
      )}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <h3>Wyszukaj produkt</h3>
      <input type="text" placeholder="Wpisz nazwę..." value={search} onChange={handleSearchChange} />

      <h3>
        Lista produktów <span className="product-count">({products.length})</span>
      </h3>
      <ProductList
        products={products}
        visibleCount={visibleCount}
        onEdit={handleEditProduct}
        user={user}
        ref={listRef}
      />

      {visibleCount < products.length && <button className='pm-button' onClick={() => setVisibleCount(Math.min(visibleCount + 10, products.length))}>Pokaż więcej</button>}
      {visibleCount > 10 && <button className='pm-button' onClick={() => setVisibleCount(Math.max(visibleCount - 10, 10))}>Pokaż mniej</button>}
      {visibleCount < products.length && <button className='pm-button' onClick={() => setVisibleCount(products.length)}>Pokaż wszystkie</button>}
      {visibleCount > 10 && <button className='pm-button' onClick={() => setVisibleCount(10)}>Resetuj widok</button>}

      {visibleCount > 10 && <ScrollButtons scrollToTop={scrollToTop} scrollToBottom={scrollToBottom} />}

      <ProductModal
        open={isModalOpen}
        product={editingProduct}
        onSave={handleSaveProduct}
        onDelete={handleDeleteFromModal}
        onClose={() => {
          setIsModalOpen(false);
          setEditingProduct(null);
        }}
      />
    </div>
  );
}