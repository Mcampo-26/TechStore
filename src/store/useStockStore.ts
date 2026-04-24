"use client";
import { create } from 'zustand';

export interface Product {
  _id: string;
  id?: string; 
  name: string;
  price: number;
  image: string;
  image2?: string;
  image3?: string;
  category: string;
  description: string;
  stock: number;
  isOferta?: boolean; 
  descuento?: number;          
  descuentoPorcentaje?: number; 
}

interface Lote {
  _id: string;
  codigo: string;
  cantidad: number;
  costoUnitario: number;
  vencimiento?: string;
  fechaVencimiento?: string;
}

export interface Stock {
  _id: string;
  producto: Product; 
  stock: number; 
  totalQuantity?: number;
  lotes: Lote[];
  stockMinimo: number;
  costoPromedio?: number;
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
  setLoading: (status: boolean) => void;
  fetchAllStock: () => Promise<void>;
  updateStockFromMovement: (id: string, total: number, log: Movimiento) => void;
}

export const useStockStore = create<StockState>((set) => ({
  stocks: [],
  movimientos: [],
  isLoading: false,

  setStocks: (stocks) => set({ stocks, isLoading: false }),
  setLoading: (status) => set({ isLoading: status }),

  fetchAllStock: async () => {
    set({ isLoading: true });
    try {
      const res = await fetch('/api/stock');
      const data = await res.json();
      
      const stocksData = (Array.isArray(data) ? data : []).map((s: any) => ({
        ...s,
        stock: s.totalQuantity ?? s.stock ?? 0, 
        lotes: (s.lotes || []).map((l: any) => ({
          ...l,
          fechaVencimiento: l.vencimiento || l.fechaVencimiento || null,
          fechaInicio: l.createdAt || l.fechaInicio || null,
          // CAMPOS DE AUDITORÍA
          usuario: l.usuarioNombre || l.usuario || "Admin",
          observacion: l.motivo || l.observacion || "Carga inicial de stock"
        }))
      }));
      set({ stocks: stocksData, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
    }
  },

  updateStockFromMovement: (id, total, log) => {
    set((state) => ({
      stocks: state.stocks.map((s) => {
        const isMatch = s._id === id || s.producto?._id === id;
        return isMatch ? { ...s, stock: total, updatedAt: new Date().toISOString() } : s;
      }),
      movimientos: [log, ...state.movimientos].slice(0, 50)
    }));
  },
}));