import { create } from 'zustand';
import { Product } from '@/types';

interface ProductState {
  products: Product[];
  currentProduct: Product | null;
  isLoading: boolean;
  // Acciones
  setProducts: (products: Product[]) => void;
  setCurrentProduct: (product: Product | null) => void;
  setLoading: (status: boolean) => void;
  updateProductInList: (updatedProduct: Product) => void;
}

export const useProductStore = create<ProductState>((set) => ({
  products: [],
  currentProduct: null,
  isLoading: false,

  // Setea la lista completa (ideal para llamar desde el useEffect del listado)
  setProducts: (products) => set({ 
    products: products.map((p: any) => ({ ...p, id: p._id || p.id })) 
  }),

  // Setea el producto actual (ideal para llamar desde el detalle)
  setCurrentProduct: (product) => set({ 
    currentProduct: product ? { ...product, id: product._id || product.id } : null 
  }),

  setLoading: (status) => set({ isLoading: status }),

  // Útil para actualizar el stock o precio sin recargar la página
  updateProductInList: (updatedProduct) => set((state) => ({
    products: state.products.map((p) => 
      (p._id === updatedProduct._id || p.id === updatedProduct.id) ? updatedProduct : p
    ),
    // Si el producto que actualizamos es el que estamos viendo, también lo actualizamos
    currentProduct: 
      (state.currentProduct?._id === updatedProduct._id || state.currentProduct?.id === updatedProduct.id)
      ? updatedProduct 
      : state.currentProduct
  })),
}));