import { create } from "zustand";
import { persist } from "zustand/middleware";

// Criação da ProductStore com persistência no sessionStorage
export const useProductStore = create(
  persist(
    (set) => ({
      // Estado inicial da store
      products: [], // Lista de produtos

      // Define os produtos na store
      setProducts: (products) => set({ products }),

      // Adiciona um novo produto à lista
      addProduct: (newProduct) =>
        set((state) => ({ products: [...state.products, newProduct] })),

      // Atualiza um produto existente na lista
      updateProduct: (updatedProduct) =>
        set((state) => ({
          products: state.products.map((product) =>
            product.id === updatedProduct.id ? updatedProduct : product
          ),
        })),

      // Remove um produto da lista pelo ID
      removeProduct: (id) =>
        set((state) => ({
          products: state.products.filter((product) => product.id !== id),
        })),
    }),
    {
      // Configuração do middleware persist
      name: "product-store", // Nome da chave no sessionStorage

      storage: {
        getItem: (name) => {
          const item = sessionStorage.getItem(name);
          return item ? JSON.parse(item) : null; // Desserializa o estado ao carregá-lo
        },
        setItem: (name, value) => {
          sessionStorage.setItem(name, JSON.stringify(value)); // Serializa o estado antes de salvar
        },
        removeItem: (name) => {
          sessionStorage.removeItem(name); // Remove o item do sessionStorage
        },
      },

      // Salva apenas a propriedade "products" no sessionStorage
      partialize: (state) => ({ products: state.products }),
    }
  )
);
