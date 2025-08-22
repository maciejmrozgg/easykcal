import { createContext, useContext, useState, useEffect } from "react";
import { fetchProducts, addProduct as addProductApi, deleteProduct as deleteProductApi, updateProduct as updateProductApi } from "./productApi";

const ProductsContext = createContext();

export function ProductsProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async (query = "") => {
    try {
      const data = await fetchProducts(query);
      setProducts(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const addProduct = async (product) => {
    try {
      const newProduct = await addProductApi(product);
      setProducts((prev) => [newProduct, ...prev]);
    } catch (err) {
      setError(err.message);
    }
  };

  const deleteProduct = async (id) => {
    try {
      await deleteProductApi(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  const updateProduct = async (id, product) => {
    try {
      const updated = await updateProductApi(id, product);
      setProducts((prev) => prev.map((p) => (p.id === id ? updated : p)));
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <ProductsContext.Provider value={{ products, error, addProduct, deleteProduct, updateProduct, loadProducts }}>
      {children}
    </ProductsContext.Provider>
  );
}

export function useProducts() {
  return useContext(ProductsContext);
}