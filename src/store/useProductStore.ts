import { create } from 'zustand';
import { Product } from '@/types';

interface ProductState {
  products: Product[];           // Backup total
  filteredProducts: Product[];   // Lo que se ve
  currentProduct: Product | null;
  isLoading: boolean;
  searchQuery: string;
  activeCategory: string; 
  
  setProducts: (products: Product[]) => void;
  setCurrentProduct: (product: Product | null) => void;
  setLoading: (status: boolean) => void;
  setSearchQuery: (query: string) => void;
  filterByCategory: (category: string) => void;
  filterByOffers: () => void;
  clearFilters: () => void;
  applyFilters: () => void;
  updateProductInList: (updatedProduct: Product) => void;
}

export const useProductStore = create<ProductState>((set, get) => ({
  products: [],
  filteredProducts: [],
  currentProduct: null,
  isLoading: false,
  searchQuery: "",
  activeCategory: "Todas",

  setProducts: (products) => {
    const safeProducts = Array.isArray(products) ? products : [];
    const formattedProducts = safeProducts.map((p: any) => ({ 
      ...p, 
      id: p._id || p.id 
    }));
    
    // Guardamos el backup
    set({ products: formattedProducts });

    // Si ya tenemos una categoría seteada (ej. desde el Navbar),
    // aplicamos el filtro sobre los productos que acaban de llegar.
    if (get().activeCategory !== "Todas" && get().activeCategory !== "") {
      get().applyFilters();
    } else {
      set({ filteredProducts: formattedProducts });
    }
    
    set({ isLoading: false });
  },

  clearFilters: () => {
    // Solo reseteamos el estado visual, NO el backup de productos
    set({ 
      filteredProducts: [], 
      activeCategory: "Todas", 
      searchQuery: "" 
    });
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

  applyFilters: () => {
    const { products, searchQuery, activeCategory } = get();

    // Si no hay productos en el backup, no podemos filtrar aún
    if (products.length === 0) {
      // No seteamos isLoading en false aquí porque todavía estamos esperando el fetch inicial
      return;
    }

    let result = [...products];

    // 1. Filtrar por Categoría u Ofertas
    if (activeCategory === "Ofertas") {
      result = result.filter(p => p.isOferta === true);
    } else if (activeCategory && activeCategory !== "Todas" && activeCategory !== "Catálogo") {
      result = result.filter(p => p.category === activeCategory);
    }

    // 2. Filtrar por Búsqueda
    if (searchQuery.trim() !== "") {
      const lowerQuery = searchQuery.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(lowerQuery) || 
        (p.category && p.category.toLowerCase().includes(lowerQuery))
      );
    }

    // 3. ACTUALIZACIÓN FINAL
    set({ 
      filteredProducts: result,
      isLoading: false // <--- IMPORTANTE: Avisamos que el filtro terminó
    });
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