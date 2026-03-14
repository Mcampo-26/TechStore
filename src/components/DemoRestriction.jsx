"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ShoppingBag, ArrowLeft, ShieldCheck } from "lucide-react";

export default function DemoRestriction() {
  const router = useRouter();

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-6 transition-colors duration-300"
      style={{ backgroundColor: 'var(--background)' }}
    >
      <div className="relative w-full max-w-md">
        
        {/* Glow decorativo adaptable */}
        <div className="absolute -inset-1 bg-blue-500/20 blur-2xl rounded-3xl" />

        <div 
          className="relative backdrop-blur-xl border shadow-2xl rounded-[2.5rem] p-8 flex flex-col items-center text-center transition-all"
          style={{ 
            backgroundColor: 'var(--card-bg)', 
            borderColor: 'var(--border-theme)' 
          }}
        >

          {/* Icono con contenedor adaptable */}
          <div className="relative mb-6">
            <div className="absolute inset-0 bg-blue-400/20 blur-xl rounded-full" />
            <div 
              className="relative shadow-md rounded-2xl p-5 border"
              style={{ backgroundColor: 'var(--nav-bg)', borderColor: 'var(--border-theme)' }}
            >
              <ShoppingBag size={40} className="text-blue-600" />
            </div>
          </div>

          {/* Título */}
          <h1 
            className="text-xl md:text-2xl font-black uppercase italic tracking-tighter mb-3"
            style={{ color: 'var(--foreground)' }}
          >
            Estás en modo <span className="text-blue-600">demostración</span>
          </h1>

          {/* Texto con opacidad controlada */}
          <p 
            className="text-sm leading-relaxed mb-8 max-w-sm font-medium opacity-80"
            style={{ color: 'var(--foreground)' }}
          >
            Este proyecto es una <strong>demo funcional para portfolio</strong>.  
            Los pagos están desactivados para evitar transacciones reales y
            proteger la información de los usuarios.
          </p>

          {/* Botones */}
          <div className="w-full flex flex-col gap-3">
            <button
              onClick={() => router.push("/")}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white py-4 rounded-xl font-black uppercase text-xs tracking-widest transition-all duration-200 shadow-lg shadow-blue-500/20 active:scale-95"
            >
              Seguir navegando
            </button>

            <button
              onClick={() => router.back()}
              className="w-full flex items-center justify-center gap-2 text-blue-600 hover:underline text-[10px] font-black uppercase tracking-widest py-2 transition"
            >
              <ArrowLeft size={16} />
              Volver al carrito
            </button>
          </div>

          {/* Footer */}
          <div 
            className="flex items-center gap-2 mt-8 opacity-40 text-[9px] font-black uppercase tracking-[0.2em]"
            style={{ color: 'var(--foreground)' }}
          >
            <ShieldCheck size={14} className="text-blue-600" />
            Entorno de prueba seguro
          </div>

        </div>
      </div>
    </div>
  );
}