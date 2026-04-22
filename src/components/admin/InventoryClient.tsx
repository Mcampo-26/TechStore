"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, Variants } from 'framer-motion';
import { 
  ArrowLeft, Download, User as UserIcon, Clock, Shield
} from 'lucide-react';
import { useStockStore } from '@/store/useStockStore';
import { useStock } from '@/hooks/useStock';
// IMPORTAMOS TU STORE DE AUTH
import { useAuthStore } from '@/store/useAuthStore';

export default function HistoryClient() {
  const router = useRouter();
  const { stocks } = useStockStore();
  const { fetchAllStock } = useStock();
  const { user: currentUser } = useAuthStore(); // Obtenemos el usuario logueado
  
  const [filter, setFilter] = useState("todos");
  const [userFilter, setUserFilter] = useState("todos");

  useEffect(() => {
    fetchAllStock();
  }, [fetchAllStock]);

  // FUNCIÓN MEJORADA: Usa el nombre del store si el ID coincide
  const obtenerNombreReal = (movimiento: any) => {
    // 1. Si el backend ya mandó un nombre, lo usamos
    if (movimiento.usuarioNombre) return movimiento.usuarioNombre;
    
    // 2. Si el ID coincide con el usuario logueado en useAuthStore, usamos ese nombre
    const idMovimiento = movimiento.usuario || "";
    const idSesion = currentUser?.id || currentUser?._id || "";
    
    if (idMovimiento === idSesion && currentUser?.nombre) {
      return currentUser.nombre;
    }

    // 3. Caso especial para el admin de la imagen si no coincide el ID
    if (idMovimiento.includes("A91798")) return "Administrador";

    // 4. Fallback si no hay nada
    return idMovimiento.length > 8 ? `Operador ${idMovimiento.slice(-4)}` : idMovimiento;
  };

  const todosLosMovimientos = stocks
    .flatMap((s: any) => s.movimientos?.map((m: any) => ({ 
      ...m, 
      productName: s.producto?.name || "Producto Eliminado",
      productSKU: s.producto?._id || s._id,
      nombreParaMostrar: obtenerNombreReal(m) // Aplicamos la lógica aquí
    })) || [])
    .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const usuariosUnicos = Array.from(new Set(todosLosMovimientos.map((m: any) => m.usuario))).filter(Boolean);

  const movimientosFiltrados = todosLosMovimientos.filter((m: any) => {
    const matchTipo = filter === "todos" || m.tipo === filter;
    const matchUser = userFilter === "todos" || m.usuario === userFilter;
    return matchTipo && matchUser;
  });

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 12, filter: "blur(8px)" },
    visible: { 
      opacity: 1, 
      y: 0, 
      filter: "blur(0px)",
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } as const
    }
  };

  return (
    <div 
      className="p-4 md:p-10 max-w-7xl mx-auto min-h-screen transition-colors duration-500"
      style={{ backgroundColor: 'var(--background)' }}
    >
      
      {/* HEADER */}
      <motion.div initial="hidden" animate="visible" variants={itemVariants} className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-10">
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
              Panel de Control e Historial
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 w-full lg:w-auto">
          <div className="relative flex-1 lg:flex-none">
            <UserIcon size={14} className="absolute left-4 top-1/2 -translate-y-1/2 opacity-40" style={{ color: 'var(--foreground)' }} />
            <select 
              onChange={(e) => setUserFilter(e.target.value)}
              className="w-full border rounded-xl pl-10 pr-8 py-3 text-[10px] font-black uppercase outline-none cursor-pointer appearance-none transition-all"
              style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-theme)', color: 'var(--foreground)' }}
            >
              <option value="todos">Todos los Usuarios</option>
              {usuariosUnicos.map((u: any) => {
                const movDeUser = todosLosMovimientos.find(m => m.usuario === u);
                return (
                  <option key={u} value={u}>
                    {movDeUser?.nombreParaMostrar}
                  </option>
                );
              })}
            </select>
          </div>

          <select 
            onChange={(e) => setFilter(e.target.value)}
            className="border rounded-xl px-6 py-3 text-[10px] font-black uppercase outline-none cursor-pointer appearance-none transition-all"
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

      {/* TABLA */}
      <motion.div 
        initial="hidden" animate="visible" variants={itemVariants}
        className="rounded-[2.5rem] border overflow-hidden shadow-2xl transition-all duration-500"
        style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-theme)' }}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b" style={{ borderColor: 'var(--border-theme)', backgroundColor: 'rgba(var(--foreground-rgb), 0.02)' }}>
                <th className="p-6 text-[9px] font-black uppercase opacity-40 tracking-widest" style={{ color: 'var(--foreground)' }}>Responsable</th>
                <th className="p-6 text-[9px] font-black uppercase opacity-40 tracking-widest" style={{ color: 'var(--foreground)' }}>Producto</th>
                <th className="p-6 text-[9px] font-black uppercase opacity-40 tracking-widest text-center">Operación</th>
                <th className="p-6 text-[9px] font-black uppercase opacity-40 tracking-widest text-right">Cant.</th>
                <th className="p-6 text-[9px] font-black uppercase opacity-40 tracking-widest text-right">Saldo</th>
                <th className="p-6 text-[9px] font-black uppercase opacity-40 tracking-widest text-center">Info</th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: 'var(--border-theme)' }}>
              {movimientosFiltrados.map((mov: any) => (
                <tr key={mov._id} className="hover:bg-blue-600/[0.02] transition-colors group">
                  <td className="p-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-600 border border-blue-500/20">
                        <Shield size={16} />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs font-black uppercase tracking-tight text-blue-600 dark:text-blue-400">
                          {mov.nombreParaMostrar}
                        </span>
                        <div className="flex items-center gap-1 opacity-40 text-[9px] font-bold" style={{ color: 'var(--foreground)' }}>
                          <Clock size={10} />
                          {new Date(mov.createdAt).toLocaleDateString()} {new Date(mov.createdAt).toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="p-6">
                    <div className="flex flex-col">
                      <span className="text-xs font-bold uppercase truncate max-w-[220px]" style={{ color: 'var(--foreground)' }}>
                        {mov.productName}
                      </span>
                      <span className="text-[8px] opacity-30 font-mono tracking-tighter uppercase">ID: {mov.productSKU?.slice(-10)}</span>
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
                    <div className="text-[8px] uppercase opacity-30 font-bold" style={{ color: 'var(--foreground)' }}>Unidades</div>
                  </td>

                  <td className="p-6 text-center">
                    <div className="flex justify-center group-hover:scale-110 transition-transform cursor-help" title={mov.notas || "Sin observaciones"}>
                      <div className="w-2 h-2 rounded-full bg-blue-600 shadow-lg shadow-blue-500/50"></div>
                    </div>
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