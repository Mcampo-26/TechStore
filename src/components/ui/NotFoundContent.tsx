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
    <section className="min-h-screen flex items-center justify-center bg-[var(--background)] px-6 py-24 overflow-hidden relative">
      
      {/* FONDO: Brillo radial sutil */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(37,99,235,0.06),transparent_70%)]" />
      
      <div className="max-w-6xl w-full relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-16 md:gap-24">
          
          {/* LADO IZQUIERDO: CORE VISUAL */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative flex-1 flex justify-center lg:justify-start"
          >
            <div className="relative w-64 h-64 md:w-80 md:h-80">
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 15 + i * 5, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 border-[0.5px] border-blue-600/10 rounded-full"
                  style={{ margin: `${i * 30}px` }}
                />
              ))}

              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="relative text-center"
                >
                  <span className="text-8xl md:text-[9rem] font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-blue-600 via-blue-400 to-transparent leading-none">
                    404
                  </span>
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-[var(--background)] border border-blue-600/20 px-4 py-1.5 rounded-full shadow-xl">
                    <Construction size={12} className="text-blue-600 animate-bounce" />
                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-blue-600">Trabajando</span>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* LADO DERECHO: TEXTOS */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex-1 text-center lg:text-left space-y-10"
          >
            <div className="space-y-6">
              <div className="inline-flex items-center gap-3 px-3 py-1.5 border border-blue-600/20 bg-blue-600/5 rounded-full">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
                </span>
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-600">
                  Próximamente
                </span>
              </div>
              
              <h1 className="text-6xl md:text-8xl font-black tracking-[0.05em] leading-[0.85] uppercase text-[var(--foreground)]">
                No <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-400">
                  Disponible
                </span>
              </h1>
              
              <p className="text-base md:text-lg text-[var(--foreground)] opacity-70 max-w-md mx-auto lg:mx-0 font-medium leading-relaxed">
                Estamos en proceso de desarrollo de este sector. ¡Vuelve pronto para ver las novedades!
              </p>
            </div>

            {/* BOTONES */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-5">
              <Link 
                href="/" 
                onClick={() => setLoading(true)}
                className="group relative w-full sm:w-auto flex items-center justify-center gap-4 bg-blue-600 text-white px-10 py-5 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] overflow-hidden shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all active:scale-95"
              >
                <Home size={16} />
                Volver al Inicio
              </Link>
              
              <Link 
                href="/productos"
                onClick={() => setLoading(true)}
                className="w-full sm:w-auto flex items-center justify-center gap-4 border border-[var(--border-theme)] bg-transparent text-[var(--foreground)] px-10 py-5 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] hover:bg-[var(--foreground)]/5 transition-all active:scale-95"
              >
                <LayoutGrid size={16} className="opacity-60" />
                Ir a Productos
              </Link>
            </div>
        </motion.div>

        </div>
      </div>
    </section>
  );
};