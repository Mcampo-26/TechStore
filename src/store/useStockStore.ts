import { create } from 'zustand';

// --- Interfaces ---
interface Lote {
  _id: string;
  codigo: string;
  cantidad: number;
  costoUnitario: number;
  fechaVencimiento?: string;
  ubicacion: string;
}

interface Stock {
  _id: string;
  producto: string; // ID del producto (ObjectId)
  totalQuantity: number;
  lotes: Lote[];
  stockMinimo: number;
  updatedAt: string;
}

interface Movimiento {
  _id: string;
  producto: string;
  tipo: 'entrada' | 'salida' | 'ajuste' | 'devolucion';
  cantidad: number;
  saldoResultante: number;
  referenciaTipo: string;
  usuario: string;
  createdAt: string;
  notas?: string;
}

interface StockState {
  stocks: Stock[];
  movimientos: Movimiento[];
  isLoading: boolean;
  
  // Acciones
  setStocks: (stocks: Stock[]) => void;
  setMovimientos: (movs: Movimiento[]) => void;
  setLoading: (status: boolean) => void;
  
  // Actualización integral (Stock + Movimiento)
  updateStockFromMovement: (productoId: string, updatedStock: Stock, newMov: Movimiento) => void;
  
  // Selectores (Getters)
  getStockByProduct: (productoId: string) => Stock | undefined;
  getLowStockProducts: () => Stock[];
}

export const useStockStore = create<StockState>((set, get) => ({
  stocks: [],
  movimientos: [],
  isLoading: false,

  setStocks: (stocks) => set({ stocks, isLoading: false }),
  
  setMovimientos: (movimientos) => set({ movimientos, isLoading: false }),
  
  setLoading: (status) => set({ isLoading: status }),

  /**
   * Esta es la función clave: Cuando el API responde con éxito tras un movimiento,
   * actualizamos el stock del producto y añadimos el registro al historial global.
   */
  updateStockFromMovement: (productoId, updatedStock, newMov) => {
    set((state) => ({
      // Actualizamos el array de stocks con el nuevo objeto procesado por el server
      stocks: state.stocks.map((s) => 
        s.producto === productoId ? updatedStock : s
      ),
      // Añadimos el movimiento al inicio del historial (limitando a los últimos 100)
      movimientos: [newMov, ...state.movimientos].slice(0, 100),
    }));
  },

  // --- Selectores ---
  
  /** Devuelve el stock completo de un producto específico */
  getStockByProduct: (productoId) => {
    return get().stocks.find((s) => s.producto === productoId);
  },

  /** Filtra rápidamente los productos que están por debajo de su stock mínimo */
  getLowStockProducts: () => {
    return get().stocks.filter((s) => s.totalQuantity <= s.stockMinimo);
  },
}));