"use client";

import React, { useEffect } from "react";
import { Home, LayoutGrid, Construction } from "lucide-react";
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
    <section className="min-h-screen flex items-center justify-center bg-[var(--background)] px-4 sm:px-6 py-12 md:py-24 overflow-hidden relative">
      
      {/* FONDO: Brillo radial sutil */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(37,99,235,0.06),transparent_70%)]" />
      
      <div className="max-w-6xl w-full relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 md:gap-24">
          
          {/* LADO IZQUIERDO: CORE VISUAL (Más pequeño en móvil) */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative flex-1 flex justify-center lg:justify-start"
          >
            <div className="relative w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80">
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 15 + i * 5, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 border-[0.5px] border-blue-600/10 rounded-full"
                  style={{ margin: `${(i + 1) * 20}px` }}
                />
              ))}

              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="relative text-center"
                >
                  {/* Tamaño ajustado para móvil: text-7xl -> text-9rem */}
                  <span className="text-7xl sm:text-8xl md:text-[9rem] font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-blue-600 via-blue-400 to-transparent leading-none">
                    404
                  </span>
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-[var(--background)] border border-blue-600/20 px-3 py-1 sm:px-4 sm:py-1.5 rounded-full shadow-xl whitespace-nowrap">
                    <Construction size={10} className="text-blue-600 animate-bounce sm:w-3 sm:h-3" />
                    <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-[0.2em] text-blue-600">Trabajando</span>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* LADO DERECHO: TEXTOS */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex-1 text-center lg:text-left space-y-8 md:space-y-10"
          >
            <div className="space-y-4 md:space-y-6">
              <div className="inline-flex items-center gap-3 px-3 py-1.5 border border-blue-600/20 bg-blue-600/5 rounded-full">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
                </span>
                <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.3em] text-blue-600">
                  Próximamente
                </span>
              </div>
              
              {/* Ajuste de tamaño de fuente responsive para evitar el corte horizontal */}
              <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight sm:tracking-[0.05em] leading-[1.1] sm:leading-[0.85] uppercase text-[var(--foreground)]">
                No <br className="hidden sm:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-400">
                  {" "}Disponible
                </span>
              </h1>
              
              <p className="text-sm sm:text-base md:text-lg text-[var(--foreground)] opacity-70 max-w-sm sm:max-w-md mx-auto lg:mx-0 font-medium leading-relaxed">
                Estamos en proceso de desarrollo de este sector. <br className="hidden sm:block" /> ¡Vuelve pronto para ver las novedades!
              </p>
            </div>

            {/* BOTONES: Full width en móvil, auto en desktop */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 md:gap-5">
              <Link 
                href="/" 
                onClick={() => setLoading(true)}
                className="group relative w-full sm:w-auto flex items-center justify-center gap-4 bg-blue-600 text-white px-8 md:px-10 py-4 md:py-5 rounded-2xl font-black text-[10px] md:text-[11px] uppercase tracking-[0.2em] overflow-hidden shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all active:scale-95"
              >
                <Home size={14} className="md:w-4 md:h-4" />
                Volver al Inicio
              </Link>
              
              <Link 
                href="/productos"
                onClick={() => setLoading(true)}
                className="w-full sm:w-auto flex items-center justify-center gap-4 border border-[var(--border-theme)] bg-transparent text-[var(--foreground)] px-8 md:px-10 py-4 md:py-5 rounded-2xl font-black text-[10px] md:text-[11px] uppercase tracking-[0.2em] hover:bg-[var(--foreground)]/5 transition-all active:scale-95"
              >
                <LayoutGrid size={14} className="opacity-60 md:w-4 md:h-4" />
                Ir a Productos
              </Link>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};