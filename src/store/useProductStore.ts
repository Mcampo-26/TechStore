import { create } from 'zustand';
import { Product } from '@/types';

interface ProductState {
  products: Product[];           // Backup total (Servidor)
  filteredProducts: Product[];   // Lo que se ve en el catálogo
  currentProduct: Product | null;
  isLoading: boolean;
  searchQuery: string;
  activeCategory: string; 
  
  // Acciones
  setProducts: (products: Product[]) => void;
  updateProductInList: (updatedProduct: Product) => void;
  addProductToList: (product: Product) => void;
  deleteProductFromList: (productId: string) => void;
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

  updateProductInList: (updatedProduct) => {
    const formatted = { ...updatedProduct, id: updatedProduct._id || updatedProduct.id };
    
    set((state) => ({
      products: state.products.map(p => 
        (p._id === formatted._id || p.id === formatted.id) ? formatted : p
      ),
      filteredProducts: state.filteredProducts.map(p => 
        (p._id === formatted._id || p.id === formatted.id) ? formatted : p
      )
    }));
  },

  addProductToList: (product) => {
    const formatted = { ...product, id: product._id || product.id };
    set((state) => ({
      products: [formatted, ...state.products],
      filteredProducts: [formatted, ...state.filteredProducts]
    }));
  },

  deleteProductFromList: (productId) => {
    set((state) => ({
      products: state.products.filter(p => p._id !== productId && p.id !== productId),
      filteredProducts: state.filteredProducts.filter(p => p._id !== productId && p.id !== productId)
    }));
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