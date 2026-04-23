import { create } from 'zustand';

interface Lote {
  _id: string;
  codigo: string;
  cantidad: number;
  costoUnitario: number;
  ubicacion: string;
}

interface Stock {
  _id: string;
  producto: any;
  stock: number; // CAMBIADO: Ahora coincide con tu imagen de Mongo
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
  usuarioNombre?: string;
  createdAt: string;
}

interface StockState {
  stocks: Stock[];
  movimientos: Movimiento[];
  isLoading: boolean;
  setStocks: (stocks: Stock[]) => void;
  setMovimientos: (movs: Movimiento[]) => void;
  setLoading: (status: boolean) => void;
  fetchAllStock: () => Promise<void>;
  updateStockFromMovement: (id: string, total: number, log: Movimiento) => void;
}

export const useStockStore = create<StockState>((set, get) => ({
  stocks: [],
  movimientos: [],
  isLoading: false,

  setStocks: (stocks) => set({ stocks, isLoading: false }),
  setMovimientos: (movimientos) => set({ movimientos, isLoading: false }),
  setLoading: (status) => set({ isLoading: status }),

  fetchAllStock: async () => {
    set({ isLoading: true });
    try {
      const res = await fetch('/api/stock');
      const data = await res.json();
      // Mapeamos para asegurar que 'stock' tenga el valor de la DB
      const stocksData = (Array.isArray(data) ? data : data.stocks || []).map((s: any) => ({
        ...s,
        stock: s.stock || s.totalQuantity || 0 // Doble validación
      }));
      set({ stocks: stocksData, movimientos: data.movimientos || [], isLoading: false });
    } catch (error) {
      set({ isLoading: false });
    }
  },

  updateStockFromMovement: (id, total, log) => {
    set((state) => ({
      stocks: state.stocks.map((s) => {
        const isMatch = s._id === id || (typeof s.producto === 'string' ? s.producto === id : s.producto?._id === id);
        return isMatch ? { ...s, stock: total, updatedAt: new Date().toISOString() } : s;
      }),
      movimientos: [log, ...state.movimientos].slice(0, 50)
    }));
  },
}));