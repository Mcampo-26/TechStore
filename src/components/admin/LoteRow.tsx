"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Package, ChevronRight, BarChart3, Info } from "lucide-react";
import LoteDetailItem from "./LoteDetailItem";
import { Stock } from "@/store/useStockStore";

interface LoteRowProps {
  item: Stock;
}

export default function LoteRow({ item }: LoteRowProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const producto = item.producto;
  const stockValue = item.stock;
  const lotes = item.lotes || [];
  const isLow = stockValue <= (item.stockMinimo || 5);

  return (
    <>
      <motion.tr 
        layout
        onClick={() => setIsExpanded(!isExpanded)}
        className={`group cursor-pointer transition-all duration-300 border-l-4 ${
          isExpanded ? 'bg-blue-600/5 border-l-blue-600' : 'hover:bg-neutral-500/5 border-l-transparent'
        } border-b border-[var(--border-theme)]`}
      >
        <td className="px-10 py-7">
          <div className="flex items-center gap-5">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border transition-colors ${
              isLow ? 'bg-red-500/10 border-red-500/20 text-red-500' : 'bg-neutral-500/10 border-[var(--border-theme)] text-[var(--foreground)] opacity-40'
            }`}>
              {producto?.image ? <img src={producto.image} className="w-8 h-8 object-contain" alt="" /> : <Package size={20} />}
            </div>
            <div>
              <p className="text-[15px] font-bold text-[var(--foreground)] leading-tight">{producto?.name || "Sin Nombre"}</p>
              <p className="text-[10px] font-mono text-[var(--foreground)] opacity-30 uppercase mt-0.5">ID: {item._id}</p>
            </div>
          </div>
        </td>

        <td className="px-10 py-7 text-center">
          <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest ${
            isLow ? 'bg-red-500/10 text-red-500' : 'bg-emerald-500/10 text-emerald-500'
          }`}>
            <div className={`w-1.5 h-1.5 rounded-full ${isLow ? 'bg-red-500 animate-pulse' : 'bg-emerald-500'}`} />
            {isLow ? 'Reponer Stock' : 'Stock Óptimo'}
          </div>
        </td>

        <td className="px-10 py-7 text-center">
          <div className="flex flex-col">
            <span className={`text-2xl font-black tracking-tighter ${isLow ? 'text-red-500' : 'text-[var(--foreground)]'}`}>
              {stockValue}
            </span>
            <span className="text-[9px] font-bold opacity-30 uppercase text-[var(--foreground)]">Existencias</span>
          </div>
        </td>

        <td className="px-10 py-7 text-right pr-14">
          <div className={`transition-transform duration-500 ${isExpanded ? 'rotate-90 text-blue-600' : 'text-neutral-400'}`}>
            <ChevronRight size={20} className="inline-block" />
          </div>
        </td>
      </motion.tr>

      <AnimatePresence>
        {isExpanded && (
          <motion.tr
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-neutral-500/5"
          >
            <td colSpan={4} className="px-10 pb-12 pt-2">
              <div className="bg-[var(--card-bg)] border border-[var(--border-theme)] rounded-[2.5rem] overflow-hidden shadow-xl">
                <div className="px-10 py-7 border-b border-[var(--border-theme)] bg-neutral-500/5 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-600 rounded-lg text-white"><BarChart3 size={16} /></div>
                    <span className="text-[11px] font-black uppercase tracking-widest text-[var(--foreground)] opacity-70">Auditoría de Lotes</span>
                  </div>
                  <div className="text-right">
                    <p className="text-[9px] font-bold opacity-40 uppercase text-[var(--foreground)]">Costo Promedio</p>
                    <p className="text-xl font-black text-emerald-600">${item.costoPromedio?.toFixed(2) || '0.00'}</p>
                  </div>
                </div>

                <table className="w-full text-left">
                  <thead>
                    <tr className="text-[9px] font-black uppercase tracking-widest text-[var(--foreground)] opacity-30 border-b border-[var(--border-theme)]">
                      <th className="pl-10 py-5">Identificador Lote</th>
                      <th className="py-5">Vencimiento</th>
                      <th className="py-5 text-center">Costo Unit.</th>
                      <th className="pr-10 py-5 text-right">Saldo</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border-theme)]">
                    {lotes.length > 0 ? lotes.map((lote: any, idx: number) => (
                      <LoteDetailItem key={lote._id || idx} lote={lote} />
                    )) : (
                      <tr>
                        <td colSpan={4} className="py-16 text-center opacity-20 text-[var(--foreground)]">
                          <Info size={40} className="mx-auto mb-2" />
                          <p className="text-xs font-black uppercase">Sin registros</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </td>
          </motion.tr>
        )}
      </AnimatePresence>
    </>
  );
}