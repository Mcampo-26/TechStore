import { create } from 'zustand';
import { Product } from '@/types';

interface ProductState {
  products: Product[];           // Base de datos completa (Backup)
  filteredProducts: Product[];   // Lo que se muestra
  currentProduct: Product | null;
  isLoading: boolean;
  searchQuery: string;
  activeCategory: string;        // Nueva: para recordar qué categoría hay
  
  // Acciones
  setProducts: (products: Product[]) => void;
  setCurrentProduct: (product: Product | null) => void;
  setLoading: (status: boolean) => void;
  setSearchQuery: (query: string) => void;
  filterByCategory: (category: string) => void;
  filterByOffers: () => void;
  applyFilters: () => void;      // La función "Cerebro"
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
    
    set({ 
      products: formattedProducts, 
      filteredProducts: formattedProducts,
      isLoading: false 
    });
  },

  // 1. Solo actualiza el texto y llama al cerebro
  setSearchQuery: (query) => {
    set({ searchQuery: query });
    get().applyFilters();
  },

  // 2. Solo actualiza la categoría y llama al cerebro
  filterByCategory: (category) => {
    set({ activeCategory: category });
    get().applyFilters();
  },

  // 3. Filtro de ofertas (puedes tratarlo como una categoría especial)
  filterByOffers: () => {
    set({ activeCategory: "Ofertas", searchQuery: "" });
    const offers = get().products.filter(p => p.isOferta);
    set({ filteredProducts: offers });
  },

  // 4. EL CEREBRO: Combina categoría Y búsqueda
  applyFilters: () => {
    const { products, searchQuery, activeCategory } = get();
    let result = [...products];

    // Primero aplicamos Categoría
    if (activeCategory !== "Todas" && activeCategory !== "Catálogo" && activeCategory !== "") {
      result = result.filter(p => p.category === activeCategory);
    }

    // Luego, sobre ese resultado, aplicamos búsqueda por texto
    if (searchQuery.trim() !== "") {
      const lowerQuery = searchQuery.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(lowerQuery) || 
        p.category.toLowerCase().includes(lowerQuery)
      );
    }

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