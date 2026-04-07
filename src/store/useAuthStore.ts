"use client";

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
        // 1. Normalización de ID (soporta MongoDB _id e id estándar)
        const normalizedUser = {
          ...userData,
          id: userData.id || userData._id || "",
          // Aseguramos que el rol sea el que viene, o 'user' por defecto
          role: userData.role || 'user'
        };

        // 2. Actualizamos el estado global de Zustand
        set({ 
          user: normalizedUser, 
          isLoggedIn: true 
        });

        // 3. SINCRONIZACIÓN CON EL SERVIDOR (COOKIES)
        // Esto permite que el proxy.ts nos deje entrar al Panel Admin
        if (typeof document !== 'undefined') {
          // Hardcode de seguridad: Si es el admin de la imagen o tiene rol admin
          if (normalizedUser.email === "admin@engine.com" || normalizedUser.role === 'admin') {
            console.log("🔐 Creando cookie de sesión para Admin...");
            // Creamos la cookie 'session' que busca tu proxy
            document.cookie = "session=true; path=/; max-age=3600; SameSite=Lax";
          }
        }

        // 4. Sincronización automática con el Carrito
        // Si el usuario trae productos guardados, los cargamos al store
        if (userData.cart && userData.cart.length > 0) {
          useCartStore.getState().setCart(userData.cart);
        }
      },

      logout: () => {
        // 1. Limpiamos estado de usuario
        set({ user: null, isLoggedIn: false });

        // 2. Limpiamos el carrito por seguridad
        useCartStore.getState().clearCart();
        
        // 3. Limpieza de cookies de sesión
        // Eliminamos 'token' y 'session' para que el Proxy bloquee el acceso
        if (typeof document !== 'undefined') {
          document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
          document.cookie = "session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
          console.log("🧹 Sesión cerrada y cookies eliminadas.");
        }
      },
    }),
    { 
      name: 'auth-storage' // Nombre de la clave en LocalStorage
    }
  )
);