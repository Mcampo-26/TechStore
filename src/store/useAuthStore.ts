import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useCartStore } from './useCartStore';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  cart?: any[];
}

interface AuthState {
  user: User | null;
  isLoggedIn: boolean;
  setLogin: (user: any) => void; // Usamos any aquí para facilitar la normalización
  logout: () => void;
}

// ASEGÚRATE DE QUE EL NOMBRE AQUÍ SEA useAuthStore
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isLoggedIn: false,

      setLogin: (userData) => {
        // Normalizamos el ID para que siempre sea 'id' aunque venga '_id'
        const normalizedUser = {
          ...userData,
          id: userData.id || userData._id || ""
        };

        set({ 
          user: normalizedUser, 
          isLoggedIn: true 
        });

        // Inyectamos el carrito en el otro store si existe
        if (userData.cart) {
          useCartStore.getState().setCart(userData.cart);
        }
      },

      logout: () => {
        set({ user: null, isLoggedIn: false });
        useCartStore.getState().clearCart();
        
        if (typeof document !== 'undefined') {
          document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        }
      },
    }),
    { 
      name: 'auth-storage' 
    }
  )
);