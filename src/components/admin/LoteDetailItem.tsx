"use client";

import React from "react";
import { Calendar, Tag, ArrowUpRight, User2, MessageSquareText } from "lucide-react";

export default function LoteDetailItem({ lote }: any) {
  const formatDate = (dateValue: any) => {
    if (!dateValue) return "---";
    const date = new Date(dateValue);
    return isNaN(date.getTime()) ? "---" : date.toLocaleDateString('es-AR', {
      day: '2-digit', month: '2-digit', year: '2-digit'
    });
  };

  // Usamos los nombres exactos de tu modelo de Mongoose
  const ingreso = lote.createdAt; 
  const vencimiento = lote.fechaVencimiento; // <--- Ahora coincide con tu Schema

  return (
    <tr className="group/item border-b border-[var(--border-theme)] last:border-0 hover:bg-blue-600/[0.02] transition-colors">
      {/* Identificador */}
      <td className="pl-10 py-5 w-[20%]">
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
            <span className="font-mono font-bold text-blue-600 text-[13px] tracking-tight uppercase">
              {lote.codigo || "S/N"}
            </span>
          </div>
          <span className="text-[10px] font-bold opacity-20 uppercase tracking-widest mt-1 ml-3.5 italic">Ref. Lote</span>
        </div>
      </td>

      {/* Cuerpo Central */}
      <td className="py-5 w-[45%]">
        <div className="flex items-center gap-6">
          <div className="flex flex-col gap-1.5 border-r border-[var(--border-theme)] pr-6 shrink-0">
            <div className="flex items-center gap-2 text-[11px] font-bold">
              <ArrowUpRight size={14} className="text-emerald-500 opacity-70" />
              <span className="opacity-30 uppercase text-[9px] w-10">Alta:</span>
              <span className="text-[var(--foreground)] opacity-80 font-mono">
                {formatDate(ingreso)}
              </span>
            </div>
            <div className="flex items-center gap-2 text-[11px] font-bold">
              <Calendar size={14} className="text-red-500 opacity-70" />
              <span className="opacity-30 uppercase text-[9px] w-10">Vence:</span>
              <span className={`${vencimiento ? "text-red-500" : "opacity-40"} font-mono`}>
                {formatDate(vencimiento)}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 opacity-60 group-hover/item:opacity-100 transition-opacity">
            <MessageSquareText size={15} className="opacity-30 shrink-0" />
            <p className="text-[12px] italic leading-tight max-w-[300px] line-clamp-2 text-[var(--foreground)]">
               Ubicación: <span className="font-bold not-italic">{lote.ubicacion || 'Deposito Central'}</span>
            </p>
          </div>
        </div>
      </td>

      {/* Operador */}
      <td className="py-5 w-[15%] text-center">
        <div className="flex flex-col items-center">
          <span className="text-[11px] font-black uppercase text-[var(--foreground)] opacity-70 tracking-tighter">
            {lote.usuario || "SISTEMA"}
          </span>
          <span className="text-[8px] font-bold opacity-20 uppercase tracking-[0.2em]">Cargado Por</span>
        </div>
      </td>

      {/* Valores */}
      <td className="pr-10 py-5 text-right w-[20%]">
        <div className="flex items-center justify-end gap-6">
          <div className="flex flex-col items-end">
            <span className="text-[12px] font-black text-[var(--foreground)]">
              ${Number(lote.costoUnitario || 0).toLocaleString('es-AR')}
            </span>
            <span className="text-[9px] font-bold opacity-20 uppercase tracking-widest">Costo</span>
          </div>
          
          <div className="px-4 py-2 bg-neutral-900 dark:bg-white text-white dark:text-black rounded-xl font-black text-[12px] min-w-[70px] text-center shadow-md">
            {lote.cantidad}
            <span className="ml-1 opacity-40 font-bold text-[9px]">U.</span>
          </div>
        </div>
      </td>
    </tr>
  );
}