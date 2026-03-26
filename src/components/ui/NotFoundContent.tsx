"use client";

import React, { useEffect } from "react";
import { Home, LayoutGrid, Terminal } from "lucide-react";
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
      
      {/* BACKGROUND: Gradiente radial sutil adaptado al tema */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(37,99,235,0.08),transparent_75%)]" />
      
      {/* GRID DE PRECISIÓN: Se adapta al color de texto del tema */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: `radial-gradient(var(--foreground) 0.5px, transparent 0.5px)`, backgroundSize: '30px 30px' }} />

      <div className="max-w-6xl w-full relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-16">
          
          {/* LADO IZQUIERDO: CORE VISUAL */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="relative flex-1 flex justify-center lg:justify-start"
          >
            <div className="relative w-72 h-72 md:w-96 md:h-96">
              {/* Órbitas Técnicas */}
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 12 + i * 4, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 border-[0.5px] border-blue-600/20 rounded-full"
                  style={{ margin: `${i * 35}px` }}
                />
              ))}

              {/* Centro: El Código de Error */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="relative"
                >
                  <span className="text-9xl md:text-[11rem] font-extrabold tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-blue-600 via-blue-400 to-transparent leading-none">
                    404
                  </span>
                  
                  {/* Etiqueta Flotante de Estado */}
                  <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-[var(--background)] border border-[var(--border-theme)] px-5 py-2 rounded-full shadow-2xl backdrop-blur-xl">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-ping" />
                    <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--foreground)] opacity-80">
                      Reconstruyendo
                    </span>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* LADO DERECHO: TEXTOS Y ACCIONES */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="flex-1 text-center lg:text-left space-y-10"
          >
            <div className="space-y-6">
              <div className="inline-flex items-center gap-3 px-4 py-2 border border-blue-600/20 bg-blue-600/5 rounded-lg">
                <Terminal size={14} className="text-blue-600" />
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-600">
                  Estado: Modo Mantenimiento
                </span>
              </div>
              
              <h1 className="text-6xl md:text-8xl font-bold tracking-tight leading-[0.85] uppercase text-[var(--foreground)]">
                Módulo en <br />
                <span className="font-light italic opacity-90 text-blue-600">Proceso</span>
              </h1>
              
              <p className="text-base md:text-lg text-[var(--foreground)] opacity-50 max-w-md mx-auto lg:mx-0 font-normal leading-relaxed">
                Nuestros ingenieros están calibrando este sector. La conexión está siendo redirigida a los nodos principales del sistema.
              </p>
            </div>

            {/* BOTONES: Adaptados al tema dark/light */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6">
  {/* BOTÓN PRINCIPAL: Azul Profundo con Brillo Dinámico */}
  <Link 
    href="/" 
    onClick={() => setLoading(true)}
    className="group relative w-full sm:w-auto flex items-center justify-center gap-4 bg-gradient-to-br from-blue-600 to-blue-700 text-white px-10 py-5 rounded-xl font-black text-[11px] uppercase tracking-[0.3em] overflow-hidden shadow-xl shadow-blue-500/20 hover:shadow-blue-500/40 hover:scale-[1.02] transition-all duration-300 active:scale-95"
  >
    {/* Efecto de luz que recorre el botón al pasar el mouse */}
    <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
    
    <Home size={16} className="relative z-10 group-hover:-translate-y-0.5 transition-transform" />
    <span className="relative z-10">Inicio</span>
  </Link>
  
  {/* BOTÓN SECUNDARIO: Glassmorphism Azulado (Elegante en Light/Dark) */}
  <Link 
    href="/productos"
    onClick={() => setLoading(true)}
    className="group w-full sm:w-auto flex items-center justify-center gap-4 border border-blue-600/20 bg-blue-600/5 text-blue-600 dark:text-blue-400 px-10 py-5 rounded-xl font-black text-[11px] uppercase tracking-[0.3em] backdrop-blur-md hover:bg-blue-600 hover:text-white transition-all duration-500 active:scale-95"
  >
    <LayoutGrid size={16} className="opacity-70 group-hover:rotate-90 group-hover:opacity-100 transition-all duration-500" />
    Catálogo
  </Link>

  {/* Estilo para la animación de brillo */}
  <style jsx>{`
    @keyframes shimmer {
      100% { transform: translateX(100%); }
    }
  `}</style>
</div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};