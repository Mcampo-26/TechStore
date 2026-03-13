import { create } from 'zustand';

interface Category {
  _id: string;
  name: string;
}

interface CategoryState {
  categories: Category[];
  loading: boolean;
  fetchCategories: () => Promise<void>;
  addCategory: (name: string) => Promise<Category | null>;
}

export const useCategoryStore = create<CategoryState>((set, get) => ({
  categories: [],
  loading: false,
  
  fetchCategories: async () => {
    set({ loading: true });
    try {
      const res = await fetch('/api/categories');
      const data = await res.json();
      set({ categories: data, loading: false });
    } catch (error) {
      console.error("Error fetching categories:", error);
      set({ loading: false });
    }
  },

  addCategory: async (name: string) => {
    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name })
      });
      const newCat = await res.json();
      // Actualizamos el estado local inmediatamente
      set({ categories: [...get().categories, newCat] });
      return newCat;
    } catch (error) {
      console.error("Error adding category:", error);
      return null;
    }
  }
}));