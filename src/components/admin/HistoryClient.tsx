"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, Variants } from 'framer-motion';
import { 
  ArrowLeft, Download, User as UserIcon, Clock, Shield 
} from 'lucide-react';
import { useStockStore } from '@/store/useStockStore';
import { useStock } from '@/hooks/useStock';
import { useAuthStore } from '@/store/useAuthStore';

export default function HistoryClient() {
  const router = useRouter();
  const { stocks } = useStockStore();
  const { fetchAllStock } = useStock();
  const { user } = useAuthStore(); // Obtenemos el usuario de la sesión actual
  
  const [filter, setFilter] = useState("todos");
  const [userFilter, setUserFilter] = useState("todos");

  useEffect(() => {
    fetchAllStock();
  }, [fetchAllStock]);

  // Procesamos movimientos: Cruzamos ID de historial con ID de sesión de Zustand
  const todosLosMovimientos = stocks
    .flatMap((s: any) => s.movimientos?.map((m: any) => {
      // Resolvemos el ID de la sesión de forma segura para TS
      const idSesion = user?.id || (user as any)?._id;
      const esMismoUsuario = m.usuario === idSesion;
      
      // Normalización lógica: 
      // 1. Si soy yo, usa mi nombre de sesión.
      // 2. Si el movimiento trae nombre de BD, úsalo.
      // 3. Fallback: Recorta el ID.
      const nombreAMostrar = esMismoUsuario 
        ? user?.nombre 
        : (m.usuarioNombre || (m.usuario ? `ID: ...${m.usuario.slice(-5).toUpperCase()}` : "Sistema"));

      return {
        ...m,
        productName: s.producto?.name || "Producto Eliminado",
        productSKU: s.producto?._id || s._id,
        nombreFinal: nombreAMostrar
      };
    }) || [])
    .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const usuariosUnicos = Array.from(new Set(todosLosMovimientos.map((m: any) => m.usuario))).filter(Boolean);

  const movimientosFiltrados = todosLosMovimientos.filter((m: any) => {
    const matchTipo = filter === "todos" || m.tipo === filter;
    const matchUser = userFilter === "todos" || m.usuario === userFilter;
    return matchTipo && matchUser;
  });

  const variants: Variants = {
    hidden: { opacity: 0, y: 15, filter: "blur(10px)" },
    visible: { 
      opacity: 1, 
      y: 0, 
      filter: "blur(0px)",
      transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } as const
    }
  };

  return (
    <div 
      className="p-4 md:p-10 max-w-7xl mx-auto min-h-screen transition-colors duration-500"
      style={{ backgroundColor: 'var(--background)' }}
    >
      
      {/* HEADER */}
      <motion.div initial="hidden" animate="visible" variants={variants} className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-10">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => router.back()}
            className="p-3 rounded-2xl border transition-all active:scale-95"
            style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-theme)', color: 'var(--foreground)' }}
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-3xl font-black tracking-tighter uppercase" style={{ color: 'var(--foreground)' }}>
              Auditoría <span className="text-blue-600">Pro</span>
            </h1>
            <p className="text-[10px] font-bold opacity-50 uppercase tracking-widest" style={{ color: 'var(--foreground)' }}>
              Trazabilidad total de inventario
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 w-full lg:w-auto">
          <div className="relative flex-1 lg:flex-none">
            <UserIcon size={14} className="absolute left-4 top-1/2 -translate-y-1/2 opacity-40" style={{ color: 'var(--foreground)' }} />
            <select 
              onChange={(e) => setUserFilter(e.target.value)}
              className="w-full border rounded-xl pl-10 pr-8 py-3 text-[10px] font-black uppercase outline-none cursor-pointer appearance-none"
              style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-theme)', color: 'var(--foreground)' }}
            >
              <option value="todos">Todos los Usuarios</option>
              {usuariosUnicos.map((u: any) => (
                <option key={u} value={u}>
                  {todosLosMovimientos.find(m => m.usuario === u)?.nombreFinal}
                </option>
              ))}
            </select>
          </div>

          <select 
            onChange={(e) => setFilter(e.target.value)}
            className="border rounded-xl px-6 py-3 text-[10px] font-black uppercase outline-none cursor-pointer appearance-none"
            style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-theme)', color: 'var(--foreground)' }}
          >
            <option value="todos">Todos los Movimientos</option>
            <option value="entrada">Entradas (+)</option>
            <option value="salida">Salidas (-)</option>
          </select>

          <button className="bg-blue-600 text-white px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition-all">
            <Download size={14} /> Reporte
          </button>
        </div>
      </motion.div>

      {/* TABLA PRINCIPAL */}
      <motion.div 
        initial="hidden" animate="visible" variants={variants}
        className="rounded-[2.5rem] border overflow-hidden shadow-2xl transition-all duration-500"
        style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-theme)' }}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b" style={{ borderColor: 'var(--border-theme)', backgroundColor: 'rgba(var(--foreground-rgb), 0.02)' }}>
                <th className="p-6 text-[9px] font-black uppercase opacity-40 tracking-widest" style={{ color: 'var(--foreground)' }}>Responsable / Fecha</th>
                <th className="p-6 text-[9px] font-black uppercase opacity-40 tracking-widest" style={{ color: 'var(--foreground)' }}>Producto</th>
                <th className="p-6 text-[9px] font-black uppercase opacity-40 tracking-widest text-center">Operación</th>
                <th className="p-6 text-[9px] font-black uppercase opacity-40 tracking-widest text-right">Cant.</th>
                <th className="p-6 text-[9px] font-black uppercase opacity-40 tracking-widest text-right">Saldo</th>
                <th className="p-6 text-[9px] font-black uppercase opacity-40 tracking-widest">Motivo</th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: 'var(--border-theme)' }}>
              {movimientosFiltrados.map((mov: any) => (
                <tr key={mov._id} className="hover:bg-blue-600/[0.02] transition-colors group">
                  <td className="p-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-600 border border-blue-500/20 shadow-inner">
                        <Shield size={16} />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs font-black uppercase tracking-tight text-blue-600 dark:text-blue-400">
                          {mov.nombreFinal}
                        </span>
                        <div className="flex items-center gap-1 opacity-40 text-[9px] font-bold" style={{ color: 'var(--foreground)' }}>
                          <Clock size={10} />
                          {new Date(mov.createdAt).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="p-6">
                    <div className="flex flex-col">
                      <span className="text-xs font-bold uppercase truncate max-w-[200px]" style={{ color: 'var(--foreground)' }}>
                        {mov.productName}
                      </span>
                      <span className="text-[9px] opacity-40 font-mono italic">SKU: {mov.productSKU?.slice(-8).toUpperCase()}</span>
                    </div>
                  </td>

                  <td className="p-6 text-center">
                    <span className={`px-3 py-1 rounded-lg border text-[9px] font-black uppercase ${
                      mov.tipo === 'entrada' 
                      ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' 
                      : 'bg-red-500/10 text-red-500 border-red-500/20'
                    }`}>
                      {mov.tipo}
                    </span>
                  </td>

                  <td className={`p-6 text-right font-black text-sm ${mov.tipo === 'entrada' ? 'text-emerald-500' : 'text-red-500'}`}>
                    {mov.tipo === 'entrada' ? '+' : '-'}{mov.cantidad}
                  </td>

                  <td className="p-6 text-right">
                    <div className="text-xs font-black" style={{ color: 'var(--foreground)' }}>{mov.saldoResultante}</div>
                    <div className="text-[8px] uppercase opacity-30 font-bold" style={{ color: 'var(--foreground)' }}>Total</div>
                  </td>

                  <td className="p-6">
                    <p className="text-[10px] font-bold opacity-60 italic leading-tight" style={{ color: 'var(--foreground)' }}>
                      {mov.notas || 'AJUSTE MANUAL'}
                    </p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}