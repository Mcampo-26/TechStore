import { create } from 'zustand';

// Definimos la estructura del Log para que TypeScript nos ayude
interface Log {
  _id: string;
  tipo: 'AUTH_LOGIN' | 'AUTH_LOGOUT' | 'STOCK_IN' | 'STOCK_OUT' | 'PRODUCT_CREATE' | 'SYSTEM_ERROR';
  nivel: 'info' | 'warning' | 'critical';
  usuarioNombre: string;
  detalles: string;
  metadata?: any;
  createdAt: string;
}

interface LogState {
  logs: Log[];
  isLoading: boolean;
  
  // Acciones
  fetchLogs: () => Promise<void>;
  addLog: (logData: Partial<Log>) => Promise<void>;
  clearLogs: () => void;
}

export const useLogStore = create<LogState>((set, get) => ({
  logs: [],
  isLoading: false,

  /**
   * Obtiene todos los logs desde tu nueva API /api/logs
   */
  fetchLogs: async () => {
    set({ isLoading: true });
    try {
      const response = await fetch('/api/logs');
      if (!response.ok) throw new Error('Error al cargar logs');
      const data = await response.json();
      set({ logs: data, isLoading: false });
    } catch (error) {
      console.error("Error fetching logs:", error);
      set({ isLoading: false });
    }
  },

  /**
   * Registra un nuevo log y lo añade al inicio de la lista local
   */
  addLog: async (logData) => {
    try {
      const response = await fetch('/api/logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(logData),
      });

      if (response.ok) {
        const newLog = await response.json();
        // Actualizamos el estado local agregando el nuevo log al principio
        set((state) => ({
          logs: [newLog, ...state.logs].slice(0, 200) // Mantenemos solo los últimos 200 en memoria
        }));
      }
    } catch (error) {
      console.error("Error al guardar el log:", error);
    }
  },

  clearLogs: () => set({ logs: [] }),
}));