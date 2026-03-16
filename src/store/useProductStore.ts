import { create } from 'zustand';
import { Product } from '@/types';

interface ProductState {
  products: Product[];
  currentProduct: Product | null;
  isLoading: boolean;
  setProducts: (products: Product[]) => void;
  setLoading: (status: boolean) => void;
  // Acciones de Servidor centralizadas
  fetchProducts: () => Promise<void>;
  fetchProductById: (id: string) => Promise<Product | null>;
  updateProductInList: (updatedProduct: Product) => void;
}

export const useProductStore = create<ProductState>((set, get) => ({
  products: [],
  currentProduct: null,
  isLoading: false,

  setProducts: (products) => set({ products }),
  setLoading: (status) => set({ isLoading: status }),

  fetchProducts: async () => {
    set({ isLoading: true });
    try {
      const res = await fetch('/api/products', { cache: 'no-store' });
      const data = await res.json();
      set({ products: data });
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      set({ isLoading: false });
    }
  },

  fetchProductById: async (id: string) => {
    set({ isLoading: true, currentProduct: null });
    try {
      const res = await fetch(`/api/products/${id}`, { cache: 'no-store' });
      const data = await res.json();
      const normalized = { ...data, id: data._id || data.id };
      set({ currentProduct: normalized });
      return normalized;
    } catch (error) {
      console.error("Error fetching product:", error);
      return null;
    } finally {
      set({ isLoading: false });
    }
  },

  updateProductInList: (updatedProduct) => set((state) => ({
    products: state.products.map((p) => 
      p._id === updatedProduct._id ? updatedProduct : p
    )
  })),
}));