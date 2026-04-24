"use client";

import React, { useEffect, useState, useMemo } from 'react';
import { Search, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import { useStockStore, Stock } from '@/store/useStockStore';
import { useLogStore } from '@/store/useLogStore';
import LoteRow from './LoteRow';

interface InventoryClientProps {
  initialProducts: any[];
}

export default function InventoryClient({ initialProducts }: InventoryClientProps) {
  const { stocks, isLoading, setStocks, fetchAllStock } = useStockStore();
  const { fetchLogs } = useLogStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    if (initialProducts?.length > 0) {
      const normalized = initialProducts.map(item => ({
        ...item,
        stock: item.totalQuantity ?? item.stock ?? 0
      }));
      setStocks(normalized as Stock[]);
    }
    fetchAllStock();
    fetchLogs();
  }, [initialProducts, setStocks, fetchAllStock, fetchLogs]);

  const filteredStocks = useMemo(() => {
    return stocks.filter((s: Stock) => {
      const nombre = (s.producto?.name || "").toLowerCase();
      const id = (s.producto?._id || s._id || "").toLowerCase();
      const query = searchTerm.toLowerCase();
      return nombre.includes(query) || id.includes(query);
    });
  }, [stocks, searchTerm]);

  const totalPages = Math.ceil(filteredStocks.length / itemsPerPage);
  const paginatedItems = filteredStocks.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="min-h-screen pt-32 pb-24 px-6 bg-[var(--background)] transition-colors duration-300">
      <div className="max-w-[1400px] mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-600">Gestión de Trazabilidad</span>
            </div>
            <h1 className="text-5xl font-black tracking-tighter uppercase italic text-[var(--foreground)]">
              INVENTARIO<span className="opacity-20">.</span>PRO
            </h1>
          </div>

          <div className="relative w-full md:w-96 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 opacity-20 group-focus-within:opacity-100 text-[var(--foreground)] transition-opacity" size={20} />
            <input 
              type="text"
              placeholder="Buscar producto o lote..."
              className="w-full pl-14 pr-6 py-4 rounded-2xl bg-[var(--card-bg)] border border-[var(--border-theme)] outline-none focus:border-blue-500 shadow-sm text-[var(--foreground)] text-sm font-medium transition-all"
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            />
          </div>
        </header>

        <div className="bg-[var(--card-bg)] border border-[var(--border-theme)] rounded-[2.5rem] shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--foreground)] opacity-30 border-b border-[var(--border-theme)]">
                  <th className="px-10 py-8 text-left">Información del Producto</th>
                  <th className="px-10 py-8 text-center">Estado de Alerta</th>
                  <th className="px-10 py-8 text-center">Stock Total</th>
                  <th className="px-10 py-8 text-right pr-14">Detalle Lotes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-theme)]">
                <AnimatePresence mode='wait'>
                  {isLoading ? (
                    <tr key="loader"><td colSpan={4} className="py-32 text-center"><Loader2 className="animate-spin mx-auto text-blue-600 opacity-20" size={40} /></td></tr>
                  ) : (
                    paginatedItems.map((item) => <LoteRow key={item._id} item={item} />)
                  )}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
          {/* Footer de paginación igual al que tenías */}
        </div>
      </div>
    </div>
  );
}