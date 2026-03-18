import { create } from 'zustand';
import { Product } from '@/types';

interface ProductState {
  products: Product[];           
  filteredProducts: Product[];   
  currentProduct: Product | null;
  isLoading: boolean;
  searchQuery: string;
  
  // Acciones
  setProducts: (products: Product[]) => void;
  setCurrentProduct: (product: Product | null) => void;
  setLoading: (status: boolean) => void;
  setSearchQuery: (query: string) => void;
  filterByCategory: (category: string) => void;
  filterByOffers: () => void;
  updateProductInList: (updatedProduct: Product) => void;
}

export const useProductStore = create<ProductState>((set) => ({
  products: [],
  filteredProducts: [],
  currentProduct: null,
  isLoading: false,
  searchQuery: "",

  setProducts: (products) => {
    console.log("📦 ZUSTAND: Recibiendo productos ->", products?.length || 0, "items");
    const safeProducts = Array.isArray(products) ? products : [];
    const formattedProducts = safeProducts.map((p: any) => ({ 
      ...p, 
      id: p._id || p.id 
    }));
    
    set({ 
      products: formattedProducts, 
      filteredProducts: formattedProducts,
      isLoading: false 
    });
    console.log("✅ ZUSTAND: Estado actualizado con", formattedProducts.length, "productos");
  },

  setSearchQuery: (query) => set((state) => {
    const lowerQuery = query.toLowerCase().trim();
    const filtered = state.products.filter((p) => 
      p.name.toLowerCase().includes(lowerQuery) || 
      p.category.toLowerCase().includes(lowerQuery)
    );
    return { searchQuery: query, filteredProducts: filtered };
  }),

  filterByCategory: (category) => set((state) => {
    console.log("🎯 ZUSTAND: Filtrando por categoría ->", category);
    const filtered = category === "Todas" 
      ? state.products 
      : state.products.filter(p => p.category === category);
    return { searchQuery: "", filteredProducts: filtered };
  }),

  filterByOffers: () => set((state) => {
    console.log("🔥 ZUSTAND: Filtrando Ofertas");
    return {
      searchQuery: "",
      filteredProducts: state.products.filter(p => p.isOferta === true)
    };
  }),

  setCurrentProduct: (product) => set({ 
    currentProduct: product ? { ...product, id: product._id || product.id } : null 
  }),

  setLoading: (status) => set({ isLoading: status }),

  updateProductInList: (updatedProduct) => set((state) => {
    const update = (p: Product) => 
      (p._id === updatedProduct._id || p.id === updatedProduct.id) ? updatedProduct : p;

    return {
      products: state.products.map(update),
      filteredProducts: state.filteredProducts.map(update),
      currentProduct: 
        (state.currentProduct?._id === updatedProduct._id || state.currentProduct?.id === updatedProduct.id)
        ? updatedProduct 
        : state.currentProduct
    };
  }),
}));