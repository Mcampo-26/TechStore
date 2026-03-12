import { create } from 'zustand';
import { Product } from '@/types';

interface ProductState {
  products: Product[];
  isLoading: boolean;
  setProducts: (products: Product[]) => void;
  setLoading: (status: boolean) => void;
  updateProductInList: (updatedProduct: Product) => void;
}

export const useProductStore = create<ProductState>((set) => ({
  products: [],
  isLoading: false,
  setProducts: (products) => set({ products }),
  setLoading: (status) => set({ isLoading: status }),
  updateProductInList: (updatedProduct) => set((state) => ({
    products: state.products.map((p) => 
      p._id === updatedProduct._id ? updatedProduct : p
    )
  })),
}));