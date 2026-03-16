import { create } from 'zustand';
import { Product } from '@/types';

interface ProductState {
  products: Product[];
  currentProduct: Product | null;
  isLoading: boolean;
  setProducts: (products: Product[]) => void;
  setLoading: (status: boolean) => void;
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
    // Si ya tenemos productos, no mostramos el loading agresivo para un mejor UX
    if (get().products.length === 0) set({ isLoading: true });
    
    try {
      const res = await fetch('/api/products', { cache: 'no-store' });
      const data = await res.json();
      // Normalizamos IDs para evitar problemas de undefined.id
      const normalized = data.map((p: any) => ({ ...p, id: p._id || p.id }));
      set({ products: normalized });
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      set({ isLoading: false });
    }
  },

  fetchProductById: async (id: string) => {
    set({ isLoading: true });
    try {
      const res = await fetch(`/api/products/${id}`, { cache: 'no-store' });
      if (!res.ok) throw new Error("Producto no encontrado");
      
      const data = await res.json();
      const normalized = { ...data, id: data._id || data.id };
      
      set({ currentProduct: normalized });
      return normalized;
    } catch (error) {
      console.error("Error fetching product:", error);
      set({ currentProduct: null });
      return null;
    } finally {
      set({ isLoading: false });
    }
  },

  updateProductInList: (updatedProduct) => set((state) => ({
    products: state.products.map((p) => 
      (p._id === updatedProduct._id || p.id === updatedProduct.id) ? updatedProduct : p
    )
  })),
}));