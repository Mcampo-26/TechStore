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
  setLogin: (userData: any) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isLoggedIn: false,

      setLogin: (userData) => {
        // Normalización garantizada de ID
        const normalizedUser = {
          ...userData,
          id: userData.id || userData._id || ""
        };

        set({ 
          user: normalizedUser, 
          isLoggedIn: true 
        });

        // Sincronización automática con el Carrito
        // Si el usuario que loguea trae productos en DB, los cargamos al store
        if (userData.cart && userData.cart.length > 0) {
          useCartStore.getState().setCart(userData.cart);
        }
      },

      logout: () => {
        set({ user: null, isLoggedIn: false });
        // Limpiamos el carrito al cerrar sesión por seguridad
        useCartStore.getState().clearCart();
        
        // Limpieza de cookies de sesión
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