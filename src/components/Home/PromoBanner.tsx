"use client";

import React from 'react';
import { ArrowRight, Zap } from 'lucide-react';
import Link from 'next/link';

export const PromoBanner = () => {
  return (
    <div className="pt-12 md:pt-24 max-w-7xl mx-auto px-4 md:px-6">
      
      <div 
        className="relative w-full rounded-3xl md:rounded-[2rem] overflow-hidden border shadow-2xl"
        style={{ 
          backgroundColor: 'var(--nav-bg)', 
          borderColor: 'var(--border-theme)',
          // ELIMINAMOS: backdropFilter y transition-all. 
          // Esto hace que el navegador lo pinte de inmediato.
        }}
      >
        <div className="relative flex flex-col md:flex-row items-center justify-between px-5 py-6 md:px-10 md:py-16">
          
          <div className="flex-1 text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 md:px-3 md:py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-500 dark:text-blue-400 text-[9px] md:text-xs font-bold uppercase tracking-widest mb-3 md:mb-6">
              <Zap size={10} className="md:w-[14px]" fill="currentColor" />
              Ofertas de Tiempo Limitado
            </div>
            
            <h2 className="text-2xl xs:text-3xl sm:text-4xl md:text-7xl font-black leading-[1] md:leading-[0.9] tracking-tighter"
                style={{ color: 'var(--foreground)' }}>
              TECNOLOGÍA <br />
              <span className="opacity-40">AL SIGUIENTE NIVEL.</span>
            </h2>
            
            <p className="mt-3 md:mt-6 opacity-60 text-xs md:text-lg max-w-sm md:max-w-md font-light leading-relaxed mx-auto md:mx-0">
              Equípate con lo mejor. Descuentos aplicados directamente en el carrito.
            </p>
          </div>

          <div className="mt-6 md:mt-0 flex flex-col items-center md:items-end gap-3 md:gap-4 w-full md:w-auto">
            
            <div className="text-center md:text-right">
              <span className="text-3xl md:text-6xl font-light italic tracking-tighter" style={{ color: 'var(--foreground)' }}>40%</span>
              <span className="text-lg md:text-2xl font-bold text-blue-600 uppercase ml-1 md:ml-2 italic">Off</span>
            </div>
            
            <Link href="/productos" className="w-full md:w-auto">
              <button 
                className="group relative flex items-center justify-center gap-3 w-full md:w-auto px-6 md:px-10 py-3.5 md:py-5 rounded-full font-bold text-sm md:text-lg transition-all duration-300 shadow-xl border border-transparent"
                style={{ 
                  backgroundColor: 'var(--foreground)', 
                  color: 'var(--background)' 
                }}
              >
                Explorar Catálogo
                <ArrowRight className="group-hover:translate-x-1 transition-transform w-4 h-4 md:w-6 md:h-6" />
              </button>
            </Link>
          </div>

        </div>

        {/* Detalle de luz: Mantenemos el efecto visual pero sin el blur general del fondo */}
        <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-blue-600/10 dark:bg-blue-600/20 blur-[100px] md:blur-[120px] pointer-events-none"></div>
      </div>
    </div>
  );
};