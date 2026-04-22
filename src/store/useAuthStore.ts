"use client";

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useCartStore } from './useCartStore';

interface User {
  id: string;
  _id?: string;
  nombre: string; // La propiedad que consume tu Navbar y TechLoader
  name?: string;   // El campo original de MongoDB
  email: string;
  role?: {
    _id: string;
    name: string;
    permisos: Record<string, boolean>;
  } | string;
  cart?: any[];
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoggedIn: boolean;
  setLogin: (userData: any, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isLoggedIn: false,

      setLogin: (userData, token) => {
        // 1. Extraemos el nombre real de la base de datos
        // Prioridad: 
        //   A. 'userData.name' (Donde MongoDB guarda "MAuricio")
        //   B. 'userData.nombre' (Por si la API ya viene procesada)
        //   C. Evitamos usar el email si el nombre real existe.
        
        let nombreFinal = "Usuario";

        if (userData.name && userData.name.toLowerCase() !== 'admin') {
          nombreFinal = userData.name;
        } else if (userData.nombre && userData.nombre.toLowerCase() !== 'admin') {
          nombreFinal = userData.nombre;
        } else {
          nombreFinal = userData.email?.split('@')[0] || "Usuario";
        }

        const normalizedUser: User = {
          ...userData,
          id: userData.id || userData._id || "",
          nombre: nombreFinal, // Forzamos el nombre limpio aquí
        };

        // 2. Actualizamos el estado global
        set({ 
          user: normalizedUser, 
          token: token,
          isLoggedIn: true 
        });

        // 3. Persistencia en Cookies para el Middleware
        if (typeof document !== 'undefined') {
          document.cookie = `token=${token}; path=/; max-age=86400; SameSite=Lax;`;
          localStorage.setItem('token', token);
        }

        // 4. Sincronización del Carrito
        if (userData.cart && Array.isArray(userData.cart)) {
          useCartStore.getState().setCart(userData.cart);
        }
      },

      logout: () => {
        set({ user: null, token: null, isLoggedIn: false });
        useCartStore.getState().clearCart();
        
        if (typeof document !== 'undefined') {
          document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
          localStorage.removeItem('token');
          // Limpiamos el storage de Zustand manualmente para evitar datos persistentes corruptos
          localStorage.removeItem('auth-storage');
        }
      },
    }),
    { 
      name: 'auth-storage',
      // Opcional: puedes usar partialize para no guardar datos sensibles, 
      // pero para este caso mantendremos la estructura actual.
    }
  )
);