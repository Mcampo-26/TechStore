import { create } from 'zustand';
import { Product } from '@/types';

interface ProductState {
  products: Product[];           // Base de datos completa (Backup)
  filteredProducts: Product[];   // Lo que se muestra actualmente
  currentProduct: Product | null;
  isLoading: boolean;
  searchQuery: string;
  activeCategory: string;        // Recordar la categoría activa
  
  // Acciones
  setProducts: (products: Product[]) => void;
  setCurrentProduct: (product: Product | null) => void;
  setLoading: (status: boolean) => void;
  setSearchQuery: (query: string) => void;
  filterByCategory: (category: string) => void;
  filterByOffers: () => void;
  clearFilters: () => void;      // Nueva: Limpia la vista antes de navegar
  applyFilters: () => void;      // El "Cerebro" de filtrado
  updateProductInList: (updatedProduct: Product) => void;
}

export const useProductStore = create<ProductState>((set, get) => ({
  products: [],
  filteredProducts: [],
  currentProduct: null,
  isLoading: false,
  searchQuery: "",
  activeCategory: "Todas",

  // Seteo inicial de productos desde el servidor o API
  setProducts: (products) => {
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
  },

  // Limpia la lista visual para que el Spinner no muestre productos viejos
  clearFilters: () => {
    set({ 
      filteredProducts: [], 
      activeCategory: "", 
      searchQuery: "" 
    });
  },

  setSearchQuery: (query) => {
    set({ searchQuery: query });
    get().applyFilters();
  },

  filterByCategory: (category) => {
    // Si ya estamos en esa categoría, no hacemos nada
    if (get().activeCategory === category) return;

    set({ activeCategory: category });
    get().applyFilters();
  },

  filterByOffers: () => {
    // Seteamos la categoría a Ofertas y disparamos el filtro
    set({ activeCategory: "Ofertas", searchQuery: "" });
    get().applyFilters();
  },

  // EL CEREBRO: Combina categoría, ofertas y búsqueda
  applyFilters: () => {
    const { products, searchQuery, activeCategory } = get();
    
    // Si no hay productos cargados en el backup, cancelamos
    if (products.length === 0) return;

    let result = [...products];

    // 1. Filtrar por Categoría u Ofertas
    if (activeCategory === "Ofertas") {
      result = result.filter(p => p.isOferta);
    } else if (activeCategory && activeCategory !== "Todas" && activeCategory !== "Catálogo") {
      result = result.filter(p => p.category === activeCategory);
    }

    // 2. Filtrar por Búsqueda (sobre el resultado anterior)
    if (searchQuery.trim() !== "") {
      const lowerQuery = searchQuery.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(lowerQuery) || 
        p.category.toLowerCase().includes(lowerQuery)
      );
    }

    // Actualizamos la lista que ve el usuario
    set({ filteredProducts: result });
  },

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