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
  // Hacemos el token opcional (?) para evitar errores en el RegisterForm
  setLogin: (userData: any, token?: string) => void;
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
        // Buscamos 'name' (Mongo) o 'nombre' (API) y evitamos que sea solo "admin"
        let nombreFinal = "";

        if (userData.name && userData.name.toLowerCase() !== 'admin') {
          nombreFinal = userData.name;
        } else if (userData.nombre && userData.nombre.toLowerCase() !== 'admin') {
          nombreFinal = userData.nombre;
        } else {
          // Fallback: nombre del email (ej: "raul" de raul@mail.com)
          nombreFinal = userData.email?.split('@')[0] || "Usuario";
        }

        const normalizedUser: User = {
          ...userData,
          id: userData.id || userData._id || "",
          nombre: nombreFinal, // Sincronizamos con el campo que lee el Navbar
        };

        const finalToken = token || null;

        // 2. Actualizamos el estado global
        set({ 
          user: normalizedUser, 
          token: finalToken,
          isLoggedIn: true 
        });

        // 3. Persistencia en Cookies para el Middleware y LocalStorage
        if (typeof document !== 'undefined' && finalToken) {
          document.cookie = `token=${finalToken}; path=/; max-age=86400; SameSite=Lax;`;
          localStorage.setItem('token', finalToken);
        }

        // 4. Sincronización del Carrito si el usuario ya tiene uno guardado
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
          // Limpiamos el storage de Zustand para evitar datos persistentes viejos
          localStorage.removeItem('auth-storage');
        }
      },
    }),
    { 
      name: 'auth-storage',
    }
  )
);