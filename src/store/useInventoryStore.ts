import { create } from 'zustand';

// --- Interfaces ---
interface Lote {
  _id?: string;
  codigo: string;
  cantidad: number;
  costoUnitario: number;
  fechaVencimiento?: string;
}

interface Stock {
  _id: string;
  producto: string; // ID del producto
  totalQuantity: number;
  lotes: Lote[];
  stockMinimo: number;
}

interface Movimiento {
  _id: string;
  tipo: 'entrada' | 'salida' | 'ajuste' | 'devolucion';
  cantidad: number;
  referenciaTipo: string;
  usuario: string;
  createdAt: string;
  notas?: string;
}

interface InventoryState {
  stocks: Stock[];
  movimientos: Movimiento[];
  isLoading: boolean;

  // Acciones
  setStocks: (stocks: Stock[]) => void;
  setMovimientos: (movs: Movimiento[]) => void;
  
  // Actualización optimista para movimientos
  registerMovimiento: (productoId: string, mov: Movimiento, updatedStock: Stock) => void;
  
  // Selectores útiles
  getStockByProduct: (productoId: string) => Stock | undefined;
}

export const useInventoryStore = create<InventoryState>((set, get) => ({
  stocks: [],
  movimientos: [],
  isLoading: false,

  setStocks: (stocks) => set({ stocks }),
  
  setMovimientos: (movimientos) => set({ movimientos }),

  /**
   * Registra un movimiento y actualiza el stock correspondiente
   * de forma atómica en el estado local.
   */
  registerMovimiento: (productoId, mov, updatedStock) => {
    set((state) => ({
      // Agregamos el movimiento al principio de la lista
      movimientos: [mov, ...state.movimientos].slice(0, 50), // Guardamos los últimos 50
      
      // Actualizamos el registro de stock específico
      stocks: state.stocks.map((s) => 
        s.producto === productoId ? updatedStock : s
      ),
    }));
  },

  getStockByProduct: (productoId) => {
    return get().stocks.find((s) => s.producto === productoId);
  },
}));