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
  fetchCategories: () => Promise<void>;
  addCategory: (name: string) => Promise<Category | null>;
  setLoading: (status: boolean) => void;
}

export const useCategoryStore = create<CategoryState>((set, get) => ({
  categories: [],
  isLoading: false,

  // Sincroniza datos que vienen del servidor (Server Components)
  setCategories: (categories) => {
    const normalized = categories.map(c => ({
      ...c,
      id: String(c._id || c.id)
    }));
    set({ categories: normalized, isLoading: false });
  },

  // Refresca los datos desde el cliente si es necesario
  fetchCategories: async () => {
    set({ isLoading: true });
    try {
      const res = await fetch('/api/categories');
      if (!res.ok) throw new Error();
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

  // Crea la categoría en la DB y actualiza el estado global
  addCategory: async (name: string) => {
    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name })
      });

      if (!res.ok) throw new Error("Error al guardar categoría");
      
      const savedCat = await res.json();
      const normalizedCat = { ...savedCat, id: String(savedCat._id || savedCat.id) };

      set((state) => ({
        categories: [...state.categories, normalizedCat].sort((a, b) => 
          a.name.localeCompare(b.name)
        )
      }));

      return normalizedCat;
    } catch (error) {
      console.error("Error en addCategory:", error);
      return null;
    }
  },

  setLoading: (status) => set({ isLoading: status }),
}));