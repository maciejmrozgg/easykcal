import { useContext } from "react";
import { ProductsContext } from "./ProductsContext";

export function useProducts() {
  return useContext(ProductsContext);
}