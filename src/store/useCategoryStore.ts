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
  addCategoryLocal: (category: Category) => void;
  setLoading: (status: boolean) => void;
}

export const useCategoryStore = create<CategoryState>((set) => ({
  categories: [],
  isLoading: false,

  // Sincroniza y normaliza datos del servidor
  setCategories: (categories) => {
    // Usamos un Map interno momentáneo para asegurar IDs únicos
    const normalized = categories.map(c => ({
      ...c,
      id: String(c._id || c.id) // Aseguramos que el ID sea string
    }));
    
    set({ categories: normalized, isLoading: false });
  },

  // Agrega una categoría al estado local (Optimistic Update)
  addCategoryLocal: (newCat) => set((state) => {
    const normalizedCat = { ...newCat, id: String(newCat._id || newCat.id) };
    
    // Evitamos duplicados por si la API responde lento y el usuario clickea dos veces
    const exists = state.categories.some(c => c.id === normalizedCat.id);
    if (exists) return state;

    return { 
      categories: [...state.categories, normalizedCat].sort((a, b) => a.name.localeCompare(b.name)) 
    };
  }),

  setLoading: (status) => set({ isLoading: status }),
}));