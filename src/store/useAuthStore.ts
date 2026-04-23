"use client";

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useCartStore } from './useCartStore';

interface User {
  id: string;
  nombre: string;
  email: string;
  role?: string | {
    _id: string;
    name: string;
    permisos: Record<string, boolean>;
  };
  cart?: any[];
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoggedIn: boolean;
  setLogin: (userData: any, token?: string) => void;
  logout: () => Promise<void>; // Ahora es una promesa por el registro del log
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoggedIn: false,

      setLogin: (userData, token) => {
        // 1. Normalización del nombre (Lógica de negocio)
        const rawName = userData.name || userData.nombre || "";
        const isAdminName = rawName.toLowerCase() === 'admin';
        
        const nombreFinal = (!isAdminName && rawName !== "") 
          ? rawName 
          : (userData.email?.split('@')[0] || "Usuario");

        const normalizedUser: User = {
          id: userData.id || userData._id || "",
          nombre: nombreFinal,
          email: userData.email || "",
          role: userData.role,
          cart: userData.cart || [],
        };

        const finalToken = token || null;

        // 2. Actualización de Cookies y LocalStorage
        if (typeof document !== 'undefined' && finalToken) {
          document.cookie = `token=${finalToken}; path=/; max-age=86400; SameSite=Lax;`;
          localStorage.setItem('token', finalToken);
        }

        // 3. Sincronización del Carrito
        if (userData.cart && Array.isArray(userData.cart)) {
          useCartStore.getState().setCart(userData.cart);
        }

        set({
          user: normalizedUser,
          token: finalToken,
          isLoggedIn: true
        });
      },

      logout: async () => {
        const currentUser = get().user;

        // 1. Registro de Auditoría (Antes de limpiar el estado)
        if (currentUser) {
          try {
            await fetch('/api/logs', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                tipo: 'AUTH_LOGOUT',
                nivel: 'info',
                usuarioId: currentUser.id,
                usuarioNombre: currentUser.nombre,
                detalles: `Cierre de sesión manual registrado.`,
              }),
            });
          } catch (error) {
            console.error("⚠️ Fallo al registrar log de salida:", error);
          }
        }

        // 2. Limpieza de Cookies y Storage
        if (typeof document !== 'undefined') {
          document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
          localStorage.removeItem('token');
          localStorage.removeItem('auth-storage');
        }

        // 3. Reset de estados globales
        useCartStore.getState().clearCart();
        set({ user: null, token: null, isLoggedIn: false });
      },
    }),
    {
      name: 'auth-storage', // Nombre de la clave en LocalStorage
    }
  )
);