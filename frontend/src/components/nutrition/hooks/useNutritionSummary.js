import { useState, useRef } from 'react';

export function useNutritionSummary() {
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [undoItem, setUndoItem] = useState(null);
  const undoTimerRef = useRef(null);

  const addProduct = (product) => {
    setSelectedProducts(prev => [
      ...prev,
      { ...product, id: crypto.randomUUID() }
    ]);
  };

  const removeProduct = (id) => {
    setSelectedProducts(prev => {
      const index = prev.findIndex(p => p.id === id);
      if (index === -1) return prev;

      const removed = prev[index];
      setUndoItem({ product: removed, index });

      if (undoTimerRef.current) {
        clearTimeout(undoTimerRef.current);
      }

      undoTimerRef.current = setTimeout(() => {
        setUndoItem(null);
        undoTimerRef.current = null;
      }, 5000);

      return prev.filter(p => p.id !== id);
    });
  };

  const undoRemove = () => {
    if (!undoItem) return;

    setSelectedProducts(prev => {
      const copy = [...prev];
      copy.splice(undoItem.index, 0, undoItem.product);
      return copy;
    });

    setUndoItem(null);

    if (undoTimerRef.current) {
      clearTimeout(undoTimerRef.current);
      undoTimerRef.current = null;
    }
  };

  const resetProducts = () => {
    if (!selectedProducts.length) return;

    const confirmed = window.confirm(
      "Czy na pewno chcesz usunąć wszystkie produkty?"
    );

    if (!confirmed) return;

    setSelectedProducts([]);
    setUndoItem(null);

    if (undoTimerRef.current) {
      clearTimeout(undoTimerRef.current);
      undoTimerRef.current = null;
    }
  };

  return {
    selectedProducts,
    addProduct,
    removeProduct,
    resetProducts,
    undoItem,
    undoRemove
  };
}