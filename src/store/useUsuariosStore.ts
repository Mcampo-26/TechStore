import { create } from 'zustand';
import axiosInstance from '../utilities/axiosInstance';

// 1. Ajustamos la interfaz para que use 'name' (como la DB) 
// pero permitimos 'nombre' para no romper el formulario actual.
interface User {
  _id: string;
  name: string;      // IMPORTANTE: Coincide con el log de Mongo
  nombre?: string;   // Opcional para compatibilidad con el Modal
  email: string;
  role?: {
    _id: string;
    name: string;
    permissions?: { 
      viewDash: boolean;
      viewUsuarios: boolean;
      viewRoles: boolean;
      viewStock: boolean;
      viewCarga: boolean;
      viewAuditoria: boolean;
    } | Record<string, boolean>;
  } | string; 
  createdAt?: string;
}

interface UsuariosState {
  usuarios: User[];
  loading: boolean;
  error: string | null;
  totalPages: number;
  currentPage: number;
  fetchUsuarios: (page?: number) => Promise<void>;
  actualizarUsuario: (id: string, data: any) => Promise<void>; // 'any' para manejar el mapeo de nombres
  eliminarUsuario: (id: string) => Promise<void>;
}

export const useUsuariosStore = create<UsuariosState>((set, get) => ({
  usuarios: [],
  loading: false,
  error: null,
  totalPages: 1,
  currentPage: 1,

  fetchUsuarios: async (page: number = 1) => {
    set({ loading: true });
    try {
      const response = await axiosInstance.get(`/api/usuarios?page=${page}`);
      // Asegúrate de que el backend envíe { usuarios: [...], totalPages: X }
      set({ 
        usuarios: response.data.usuarios, 
        totalPages: response.data.totalPages,
        currentPage: page,
        loading: false 
      });
    } catch (error) {
      set({ loading: false, error: 'No se pudo sincronizar con el servidor' });
    }
  },

  actualizarUsuario: async (id, userData) => {
    set({ loading: true });
    
    // MAPEO DE SEGURIDAD: 
    // Si el modal manda 'nombre', lo convertimos a 'name' para que Mongo lo guarde.
    const cleanData = {
      ...userData,
      name: userData.name || userData.nombre,
      role: typeof userData.role === 'object' ? userData.role._id : userData.role
    };

    try {
      const response = await axiosInstance.put(`/api/usuarios/${id}`, cleanData);
      
      // Actualizamos el estado local con la respuesta (que ya viene con el role poblado)
      set((state) => ({
        usuarios: state.usuarios.map((u) => u._id === id ? response.data : u),
        loading: false
      }));

      // Refrescamos para asegurar consistencia
      await get().fetchUsuarios(get().currentPage);
      
    } catch (error: any) {
      console.error("❌ ZUSTAND ERROR:", error.response?.data || error.message);
      set({ loading: false });
      throw error;
    }
  },

  eliminarUsuario: async (id) => {
    set({ loading: true });
    try {
      await axiosInstance.delete(`/api/usuarios/${id}`);
      const { currentPage, usuarios } = get();

      if (usuarios.length === 1 && currentPage > 1) {
        get().fetchUsuarios(currentPage - 1);
      } else {
        get().fetchUsuarios(currentPage);
      }
      set({ loading: false });
    } catch (error: any) {
      set({ loading: false });
      throw error;
    }
  }
}));