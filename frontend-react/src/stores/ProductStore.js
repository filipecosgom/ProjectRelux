import { create } from "zustand";

// Store para gerenciar os produtos
export const useProductStore = create((set) => ({
  products: [], // Lista de produtos
  setProducts: (products) => set({ products }), // Define os produtos na store
  addProduct: (newProduct) =>
    set((state) => ({ products: [...state.products, newProduct] })), // Adiciona um novo produto
  updateProduct: (updatedProduct) =>
    set((state) => ({
      products: state.products.map((product) =>
        product.id === updatedProduct.id ? updatedProduct : product
      ),
    })), // Atualiza um produto existente
  removeProduct: (id) =>
    set((state) => ({
      products: state.products.filter((product) => product.id !== id),
    })), // Remove um produto pelo ID
}));
