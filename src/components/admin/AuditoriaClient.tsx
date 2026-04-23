"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Download, User as UserIcon, Clock, Shield, Activity, Loader2 } from 'lucide-react';
import { useLogStore } from '@/store/useLogStore';
import { useAuthStore } from '@/store/useAuthStore';

export default function AuditoriaClient() {
  const router = useRouter();
  const { logs, fetchLogs, isLoading } = useLogStore(); 
  const { user, isLoggedIn } = useAuthStore(); 
  
  const [filter, setFilter] = useState("todos");

  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/login');
      return;
    }
    fetchLogs(); 
  }, [fetchLogs, isLoggedIn, router]);

  const isAdmin = user?.email === 'admin@engine.com' || (user?.role === 'admin');

  const logsFiltrados = logs.filter((log: any) => {
    const passesSecurity = isAdmin ? true : log.usuarioId === (user?.id || (user as any)?._id);
    const matchTipo = filter === "todos" || log.tipo === filter;
    return passesSecurity && matchTipo;
  });

  return (
    // CONTENEDOR PRINCIPAL: Usa var(--background)
    <div className="p-4 md:p-10 max-w-7xl mx-auto min-h-screen bg-[var(--background)] text-[var(--foreground)] transition-colors duration-500 pt-32">
      
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-10">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => router.back()} 
            className="p-3 rounded-2xl bg-[var(--card-bg)] border border-[var(--border-theme)] hover:bg-blue-600 hover:text-white transition-all text-[var(--foreground)]"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-3xl font-black tracking-tighter uppercase italic text-[var(--foreground)]">
              Terminal de <span className="text-blue-600">Auditoría</span>
            </h1>
            <p className="text-[10px] font-bold opacity-40 uppercase tracking-widest">
               Registros detectados: {logsFiltrados.length}
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          {isLoading && <Loader2 className="animate-spin text-blue-600" size={20} />}
          <select 
            onChange={(e) => setFilter(e.target.value)}
            className="bg-[var(--card-bg)] border border-[var(--border-theme)] rounded-xl px-4 py-2 text-[10px] font-black uppercase text-[var(--foreground)] outline-none focus:ring-2 ring-blue-500/50"
          >
            <option value="todos">Todos los eventos</option>
            <option value="AUTH_LOGIN">Inicios de Sesión</option>
            <option value="STOCK_IN">Entradas de Stock</option>
            <option value="STOCK_OUT">Salidas de Stock</option>
          </select>
        </div>
      </div>

      {/* TABLA DE LOGS: Usa var(--card-bg) y var(--border-theme) */}
      <div className="rounded-[2rem] border border-[var(--border-theme)] bg-[var(--card-bg)] overflow-hidden shadow-2xl transition-colors duration-500">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-[var(--border-theme)] bg-[var(--foreground)]/[0.03]">
                <th className="p-6 text-[9px] font-black uppercase opacity-40 tracking-widest text-[var(--foreground)]">Evento / Fecha</th>
                <th className="p-6 text-[9px] font-black uppercase opacity-40 tracking-widest text-[var(--foreground)]">Usuario</th>
                <th className="p-6 text-[9px] font-black uppercase opacity-40 tracking-widest text-[var(--foreground)]">Detalles de Actividad</th>
                <th className="p-6 text-[9px] font-black uppercase opacity-40 tracking-widest text-right text-[var(--foreground)]">Estado</th>
              </tr>
            </thead>
            <tbody className="relative">
              <AnimatePresence mode='popLayout'>
                {logsFiltrados.map((log: any) => (
                  <motion.tr 
                    key={log._id}
                    layout 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4 }}
                    className="border-b border-[var(--border-theme)] hover:bg-blue-600/[0.02] transition-colors"
                  >
                    <td className="p-6">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center border ${
                          log.tipo.startsWith('AUTH') 
                          ? 'bg-blue-500/10 border-blue-500/20 text-blue-600' 
                          : 'bg-purple-500/10 border-purple-500/20 text-purple-500'
                        }`}>
                          {log.tipo.startsWith('AUTH') ? <Shield size={16} /> : <Activity size={16} />}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[10px] font-black uppercase tracking-tighter text-[var(--foreground)]">
                            {log.tipo.replace('_', ' ')}
                          </span>
                          <span className="text-[9px] opacity-40 font-mono text-[var(--foreground)]">
                            {new Date(log.createdAt).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="p-6">
                      <div className="flex items-center gap-2">
                        <UserIcon size={12} className="opacity-30 text-[var(--foreground)]" />
                        <span className="text-xs font-bold opacity-80 text-[var(--foreground)]">{log.usuarioNombre || 'Sistema'}</span>
                      </div>
                    </td>
                    <td className="p-6">
                      <p className="text-xs opacity-60 italic text-[var(--foreground)] max-w-md">
                        "{log.detalles}"
                      </p>
                      {log.metadata?.ip && (
                        <span className="text-[8px] font-mono opacity-20 text-[var(--foreground)]">IP: {log.metadata.ip}</span>
                      )}
                    </td>
                    <td className="p-6 text-right">
                      <span className="text-[9px] font-black px-2 py-1 rounded bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                        SUCCESS
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
          
          {logsFiltrados.length === 0 && !isLoading && (
            <div className="p-20 text-center opacity-20 text-[var(--foreground)] text-xs uppercase tracking-widest font-black">
              No hay registros disponibles
            </div>
          )}
        </div>
      </div>
    </div>
  );
}