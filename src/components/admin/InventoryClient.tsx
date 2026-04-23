"use client";

import React, { useEffect, useState } from 'react';
import { 
  Package, Search, Plus, ChevronLeft, ChevronRight, 
  ArrowUpRight, ShoppingCart, Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStockStore } from '@/store/useStockStore';
import  {useStock}  from '@/hooks/useStock';
import { useLogStore } from '@/store/useLogStore';

interface InventoryClientProps {
  initialProducts: any[];
}

export default function InventoryClient({ initialProducts }: InventoryClientProps) {
  // Extraemos stocks del store para que sea la única fuente de verdad reactiva
  const { stocks, isLoading, setStocks } = useStockStore();
  const { applyMovimiento, isProcessing } = useStock();
  const { fetchLogs } = useLogStore();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  // Sincronización inicial: Si cambian los props, actualizamos el store global
  useEffect(() => {
    if (initialProducts && initialProducts.length > 0) {
      setStocks(initialProducts);
    }
    fetchLogs();
  }, [initialProducts, setStocks, fetchLogs]);

  // Filtrado sobre el estado GLOBAL (stocks), no sobre los props iniciales
  const filteredStocks = stocks.filter(s => {
    const nombre = (s as any).producto?.name || (s as any).name || "";
    const id = (s as any).producto?._id || (s as any)._id || "";
    return nombre.toLowerCase().includes(searchTerm.toLowerCase()) || 
           id.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const totalPages = Math.ceil(filteredStocks.length / itemsPerPage);
  const paginatedItems = filteredStocks.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="min-h-screen pt-32 pb-24 px-6 bg-[var(--background)] transition-colors duration-500">
      <div className="max-w-[1400px] mx-auto">
        
        {/* HEADER */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-16">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-600">Sincronizado con BD</span>
            </div>
            <h1 className="text-6xl font-black tracking-tighter uppercase italic text-[var(--foreground)]">
              STOCK<span className="opacity-20">.</span>CONTROL
            </h1>
          </div>

          <div className="flex gap-4 w-full md:w-auto">
            <div className="relative flex-1 md:w-96 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 opacity-20 group-focus-within:opacity-100 transition-opacity text-[var(--foreground)]" size={20} />
              <input 
                type="text"
                placeholder="Buscar por nombre o ID..."
                className="w-full pl-14 pr-6 py-5 rounded-2xl bg-[var(--card-bg)] border border-[var(--border-theme)] outline-none focus:border-blue-600/50 transition-all text-sm font-medium text-[var(--foreground)]"
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              />
            </div>
          </div>
        </header>

        {/* TABLA PRINCIPAL */}
        <div className="bg-[var(--card-bg)] border border-[var(--border-theme)] rounded-[2.5rem] shadow-2xl overflow-hidden transition-colors duration-500">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-[10px] font-black uppercase tracking-[0.2em] opacity-30 border-b border-[var(--border-theme)] text-[var(--foreground)]">
                  <th className="px-10 py-8 text-left">Referencia de Producto</th>
                  <th className="px-10 py-8 text-center">Estado</th>
                  <th className="px-10 py-8 text-center">Unidades Reales</th>
                  <th className="px-10 py-8 text-right">Operaciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-theme)]">
                <AnimatePresence mode='wait'>
                  {isLoading ? (
                    <tr><td colSpan={4} className="py-32 text-center"><Loader2 className="animate-spin mx-auto opacity-20" size={40} /></td></tr>
                  ) : (
                    paginatedItems.map((item) => (
                      <ProductRow 
                        key={item._id} 
                        item={item} 
                        onAction={applyMovimiento} 
                        isProcessing={isProcessing} 
                      />
                    ))
                  )}
                </AnimatePresence>
              </tbody>
            </table>
          </div>

          {/* PAGINACIÓN */}
          <footer className="px-10 py-8 bg-[var(--background)] flex justify-between items-center border-t border-[var(--border-theme)]">
            <span className="text-[10px] font-black uppercase opacity-40 text-[var(--foreground)]">Mostrando {paginatedItems.length} de {filteredStocks.length}</span>
            <div className="flex gap-2">
              <button 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                className="p-3 rounded-xl bg-[var(--card-bg)] border border-[var(--border-theme)] text-[var(--foreground)] hover:bg-blue-600 hover:text-white disabled:opacity-10 transition-all"
                disabled={currentPage === 1}
              >
                <ChevronLeft size={20} />
              </button>
              <button 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                className="p-3 rounded-xl bg-[var(--card-bg)] border border-[var(--border-theme)] text-[var(--foreground)] hover:bg-blue-600 hover:text-white disabled:opacity-10 transition-all"
                disabled={currentPage === totalPages || totalPages === 0}
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}

function ProductRow({ item, onAction, isProcessing }: any) {
  // IMPORTANTE: Mapeo exacto de las propiedades que vienen de tu API
  // El stock real suele venir en 'totalQuantity' si es un agregado, o 'stock' si es directo.
  const stockValue = item.totalQuantity ?? item.stock ?? item.cantidad ?? 0;
  const name = item.producto?.name || item.name || "Sin Nombre";
  const id = item.producto?._id || item._id;
  const isLow = stockValue <= (item.stockMinimo || 5);

  return (
    <motion.tr 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="group hover:bg-blue-600/[0.02] transition-colors"
    >
      <td className="px-10 py-7">
        <div className="flex items-center gap-5">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border transition-all ${
            isLow ? 'bg-red-500/10 border-red-500/20 text-red-500' : 'bg-blue-600/10 border-blue-600/20 text-blue-600'
          }`}>
            <Package size={24} />
          </div>
          <div>
            <p className="text-[15px] font-bold leading-snug mb-1 max-w-md text-[var(--foreground)]">{name}</p>
            <p className="text-[10px] font-mono opacity-30 tracking-widest uppercase text-[var(--foreground)]">REF-{id.toString().slice(-6).toUpperCase()}</p>
          </div>
        </div>
      </td>
      <td className="px-10 py-7 text-center">
        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest ${
          isLow ? 'bg-red-500/10 text-red-500' : 'bg-emerald-500/10 text-emerald-500'
        }`}>
          {isLow ? 'Stock Crítico' : 'Disponible'}
        </div>
      </td>
      <td className="px-10 py-7 text-center">
        <div className="flex flex-col text-[var(--foreground)]">
          <span className="text-3xl font-black tracking-tighter leading-none">
            {stockValue}
          </span>
          <span className="text-[9px] font-black opacity-20 uppercase mt-1">Unidades</span>
        </div>
      </td>
      <td className="px-10 py-7 text-right">
        <div className="flex justify-end gap-3">
          <button 
            disabled={isProcessing}
            onClick={() => onAction(id, 1, 'entrada', 'Ajuste Manual')}
            className="w-12 h-12 flex items-center justify-center rounded-2xl bg-[var(--background)] border border-[var(--border-theme)] text-[var(--foreground)] hover:text-blue-600 transition-all active:scale-90 disabled:opacity-50"
          >
            <ArrowUpRight size={20} />
          </button>
          <button 
            disabled={isProcessing || stockValue <= 0}
            onClick={() => onAction(id, 1, 'salida', 'Venta Directa')}
            className="w-12 h-12 flex items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all active:scale-90 disabled:opacity-50"
          >
            <ShoppingCart size={20} />
          </button>
        </div>
      </td>
    </motion.tr>
  );
}