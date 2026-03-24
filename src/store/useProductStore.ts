import { create } from 'zustand';
import { Product } from '@/types';

interface ProductState {
  products: Product[];           // Backup total (Servidor)
  filteredProducts: Product[];   // Lo que se ve en el catálogo
  currentProduct: Product | null;
  isLoading: boolean;
  searchQuery: string;
  activeCategory: string;        // <--- Nombre correcto
  
  setProducts: (products: Product[]) => void;
  setCurrentProduct: (product: Product | null) => void;
  setLoading: (status: boolean) => void;
  setSearchQuery: (query: string) => void;
  filterByCategory: (category: string) => void;
  filterByOffers: () => void;
  clearFilters: () => void;
  applyFilters: () => void;
}

export const useProductStore = create<ProductState>((set, get) => ({
  products: [],
  filteredProducts: [],
  currentProduct: null,
  isLoading: false,
  searchQuery: "",
  activeCategory: "Todas",

  setProducts: (newProducts) => {
    const formatted = Array.isArray(newProducts) 
      ? newProducts.map(p => ({ ...p, id: p._id || p.id })) 
      : [];

    set((state) => {
      const { searchQuery, activeCategory } = state;
      let result = [...formatted];

      if (activeCategory === "Ofertas") {
        result = result.filter(p => p.isOferta);
      } else if (activeCategory !== "Todas" && activeCategory !== "Catálogo") {
        result = result.filter(p => p.category === activeCategory);
      }

      if (searchQuery.trim() !== "") {
        const q = searchQuery.toLowerCase();
        result = result.filter(p => 
          p.name.toLowerCase().includes(q) || 
          p.category?.toLowerCase().includes(q)
        );
      }

      return {
        products: formatted,
        filteredProducts: result,
        isLoading: false
      };
    });
  },

  applyFilters: () => {
    const { products, searchQuery, activeCategory } = get();
    let result = [...products];

    if (activeCategory === "Ofertas") {
      result = result.filter(p => p.isOferta);
    } else if (activeCategory !== "Todas" && activeCategory !== "Catálogo") {
      result = result.filter(p => p.category === activeCategory);
    }

    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(q) || 
        p.category?.toLowerCase().includes(q)
      );
    }

    set({ filteredProducts: result, isLoading: false });
  },

  setSearchQuery: (query) => {
    set({ searchQuery: query });
    get().applyFilters();
  },

  filterByCategory: (category) => {
    set({ activeCategory: category });
    get().applyFilters();
  },

  filterByOffers: () => {
    set({ activeCategory: "Ofertas", searchQuery: "" });
    get().applyFilters();
  },

  clearFilters: () => {
    set((state) => ({
      activeCategory: "Todas",
      searchQuery: "",
      filteredProducts: state.products 
    }));
  },

  setCurrentProduct: (product) => set({ 
    currentProduct: product ? { ...product, id: product._id || product.id } : null 
  }),

  setLoading: (status) => set({ isLoading: status }),
}));