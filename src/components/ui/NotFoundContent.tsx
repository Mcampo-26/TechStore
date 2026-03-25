"use client";

import React, { useEffect } from "react";
import { Home, Laptop, Zap, Bot } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useProductStore } from "@/store/useProductStore";

export const NotFoundContent = () => {
  const setLoading = useProductStore((state) => state.setLoading);

  useEffect(() => {
    setLoading(false);
    document.body.style.cursor = 'default';
  }, [setLoading]);

  return (
    <section className="min-h-[85vh] flex flex-col items-center justify-center relative px-6 overflow-hidden">
      
      {/* ELEMENTOS DECORATIVOS DE FONDO (BLUR) */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-600/10 rounded-full blur-[120px] -z-10 animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-600/10 rounded-full blur-[120px] -z-10" />

      <div className="max-w-4xl w-full text-center">
        
        {/* ICONO CENTRAL ANIMADO */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="relative inline-block mb-12"
        >
          <div className="absolute inset-0 bg-blue-600/20 blur-3xl rounded-full" />
          <div className="relative bg-[var(--card-bg)] border border-[var(--border-theme)] p-8 rounded-[3rem] shadow-2xl">
            <motion.div
              animate={{ 
                rotate: [0, 5, -5, 0],
                y: [0, -10, 0]
              }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <Bot size={60} className="text-blue-600" />
            </motion.div>
          </div>
          
          {/* BADGE DE ESTADO */}
          <motion.div 
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="absolute -top-2 -right-6 bg-blue-600 text-white text-[9px] font-black px-3 py-1.5 rounded-full uppercase tracking-tighter shadow-xl"
          >
            Offline 404
          </motion.div>
        </motion.div>

        {/* TEXTO PRINCIPAL */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4 mb-12"
        >
          <h1 className="text-5xl md:text-8xl font-black tracking-tight uppercase leading-none italic">
            Módulo en <span className="text-blue-600 not-italic">Obras</span>
          </h1>
          <div className="flex items-center justify-center gap-3 opacity-40">
            <Zap size={14} className="text-blue-600" />
            <p className="text-sm font-bold uppercase tracking-[0.4em]">
              Actualizando protocolos de sistema
            </p>
            <Zap size={14} className="text-blue-600" />
          </div>
          <p className="max-w-md mx-auto text-lg opacity-60 font-medium leading-relaxed">
            La sección solicitada se encuentra bajo mantenimiento preventivo. Estamos optimizando los núcleos de datos.
          </p>
        </motion.div>

        {/* BOTÓN ÚNICO Y PODEROSO */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Link 
            href="/" 
            onClick={() => setLoading(true)}
            className="group relative inline-flex items-center gap-4 bg-blue-600 text-white px-12 py-6 rounded-2xl font-black text-xs uppercase tracking-[0.3em] overflow-hidden shadow-2xl shadow-blue-600/30 hover:scale-105 transition-all active:scale-95"
          >
            {/* Efecto de brillo que pasa por el botón */}
            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
            
            <Home size={18} />
            <span>Volver al Panel Principal</span>
          </Link>
        </motion.div>

        {/* DECORACIÓN TÉCNICA INFERIOR */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          transition={{ delay: 0.6 }}
          className="mt-20 grid grid-cols-3 gap-8 max-w-sm mx-auto"
        >
          <div className="h-[1px] bg-gradient-to-r from-transparent via-[var(--foreground)] to-transparent" />
          <div className="h-[1px] bg-gradient-to-r from-transparent via-blue-600 to-transparent" />
          <div className="h-[1px] bg-gradient-to-r from-transparent via-[var(--foreground)] to-transparent" />
        </motion.div>
      </div>

      <style jsx>{`
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `}</style>
    </section>
  );
};