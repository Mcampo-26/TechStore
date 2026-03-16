import { create } from 'zustand';

interface Category {
  id: string;
  _id?: string;
  name: string;
}

interface CategoryState {
  categories: Category[];
  isLoading: boolean;
  setCategories: (categories: Category[]) => void;
  fetchCategories: () => Promise<void>; // Lo que pedía el Modal
  addCategory: (category: Category) => void; // Nombre estándar para el Modal
  setLoading: (status: boolean) => void;
}

export const useCategoryStore = create<CategoryState>((set) => ({
  categories: [],
  isLoading: false,

  setCategories: (categories) => {
    const normalized = categories.map(c => ({
      ...c,
      id: String(c._id || c.id)
    }));
    set({ categories: normalized, isLoading: false });
  },

  fetchCategories: async () => {
    set({ isLoading: true });
    try {
      // Importante: Esto asume que tienes una ruta api/categories/route.ts
      const res = await fetch('/api/categories');
      const data = await res.json();
      const normalized = data.map((c: any) => ({ 
        ...c, 
        id: String(c._id || c.id) 
      }));
      set({ categories: normalized, isLoading: false });
    } catch (error) {
      console.error("Error al refrescar categorías:", error);
      set({ isLoading: false });
    }
  },

  addCategory: (newCat) => set((state) => {
    const normalizedCat = { ...newCat, id: String(newCat._id || newCat.id) };
    if (state.categories.some(c => c.id === normalizedCat.id)) return state;
    
    return { 
      categories: [...state.categories, normalizedCat].sort((a, b) => a.name.localeCompare(b.name)) 
    };
  }),

  setLoading: (status) => set({ isLoading: status }),
}));