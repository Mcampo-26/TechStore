import { create } from 'zustand';
import axiosInstance from '../utilities/axiosInstance';

interface Permissions {
  viewDash: boolean;
  viewUsuarios: boolean;
  viewRoles: boolean;
  viewStock: boolean;
  viewCarga: boolean;
  viewAuditoria: boolean;
}

interface Role {
  _id: string;
  name: string;
  permissions: Permissions | Record<string, boolean>;
}

interface RoleState {
  roles: Role[];
  loading: boolean;
  error: string | null;
  
  // Actions
  fetchRoles: () => Promise<void>;
  createRole: (name: string, permissions: Record<string, boolean>) => Promise<void>;
  // FUNCIÓN AGREGADA Y CORREGIDA (Sin /update/)
  actualizarRol: (id: string, roleData: Partial<Role>) => Promise<void>;
  deleteRole: (id: string) => Promise<void>;
}

export const useRoleStore = create<RoleState>((set, get) => ({
  roles: [],
  loading: false,
  error: null,

  fetchRoles: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.get('/api/roles'); 
      set({ roles: response.data, loading: false });
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Error al obtener roles', 
        loading: false 
      });
    }
  },

  createRole: async (name, permissions) => {
    set({ loading: true });
    try {
      await axiosInstance.post('/api/roles', { name, permissions });
      // Refrescamos usando la función ya existente
      await get().fetchRoles();
      set({ loading: false });
    } catch (error: any) {
      set({ loading: false });
      throw error;
    }
  },

  // CORRECCIÓN: Ruta alineada con tu carpeta api/roles/[id]/route.ts
  actualizarRol: async (id, roleData) => {
    set({ loading: true });
    try {
      // IMPORTANTE: Quitamos cualquier subcarpeta 'update' que causaba el 404
      const response = await axiosInstance.put(`/api/roles/${id}`, roleData);
      
      // Actualizamos el estado local inmediatamente
      set((state) => ({
        roles: state.roles.map((r) => (r._id === id ? response.data : r)),
        loading: false
      }));
      
      // Opcional: Refrescar de la DB para asegurar sincronización
      await get().fetchRoles();
    } catch (error: any) {
      set({ loading: false });
      console.error("Error actualizando rol:", error.response?.data || error.message);
      throw error;
    }
  },

  deleteRole: async (id) => {
    set({ loading: true });
    try {
      await axiosInstance.delete(`/api/roles/${id}`);
      set((state) => ({
        roles: state.roles.filter((r) => r._id !== id),
        loading: false
      }));
    } catch (error: any) {
      set({ loading: false });
      throw error;
    }
  }
}));

export default useRoleStore;