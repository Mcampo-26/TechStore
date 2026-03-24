"use client";

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; // Cambiamos a useRouter
import { ArrowLeft, Home, Construction, Cog } from 'lucide-react';

export default function NotFound() {
  const router = useRouter(); // Inicializamos el router

  return (
    <div className="min-h-screen flex items-center justify-center px-6 relative overflow-hidden transition-colors duration-300"
          style={{ backgroundColor: 'var(--background)' }}>
      
      {/* Luces de fondo dinámicas */}
      <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full blur-3xl animate-pulse opacity-20 dark:opacity-10" 
            style={{ backgroundColor: 'var(--accent-color, #3b82f6)' }} />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full blur-3xl opacity-20 dark:opacity-10" 
            style={{ backgroundColor: 'var(--foreground)' }} />
      
      <div className="max-w-md w-full text-center z-10">
        <div className="flex justify-center mb-8 relative">
          {/* Engranajes girando */}
          <Cog size={100} className="absolute opacity-10 animate-spin" 
                style={{ color: 'var(--foreground)', animationDuration: '8s' }} />
          
          <div className="p-6 rounded-[2.5rem] shadow-xl border relative transition-all"
                style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-theme)' }}>
            <Construction size={48} className="text-blue-600 dark:text-blue-400" />
          </div>
        </div>

        <div className="inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-4"
              style={{ backgroundColor: 'var(--nav-bg)', color: 'var(--foreground)' }}>
          Status: 404_UNDER_CONSTRUCTION
        </div>

        <h1 className="text-4xl font-black mb-2 tracking-tighter uppercase"
            style={{ color: 'var(--foreground)' }}>
          Sección en construcción
        </h1>
        
        <p className="text-sm font-medium mb-10 leading-relaxed opacity-60"
           style={{ color: 'var(--foreground)' }}>
          Nuestros ingenieros están ensamblando esta parte del sistema. ¡Vuelve pronto para ver las novedades!
        </p>

        <div className="flex flex-col gap-3">
          <Link href="/">
            <button className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold text-xs tracking-[0.2em] uppercase hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/20 flex items-center justify-center gap-3 group">
              <Home size={16} />
              Volver al inicio
            </button>
          </Link>
          
          {/* BOTÓN REGRESAR CORREGIDO CON ROUTER */}
          <button 
            onClick={() => router.back()} // Usamos router.back() en lugar de window
            className="w-full py-4 rounded-2xl font-bold text-xs tracking-[0.2em] uppercase border-2 transition-all flex items-center justify-center gap-3 group"
            style={{ 
              backgroundColor: 'var(--card-bg)', 
              color: 'var(--foreground)',
              borderColor: 'var(--border-theme)' 
            }}
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Regresar
          </button>
        </div>
      </div>

      {/* Grid de fondo adaptable */}
      <div className="absolute inset-0 z-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] invert dark:invert-0" />

      <div className="absolute bottom-8 text-[9px] font-black uppercase tracking-[0.4em] opacity-30"
           style={{ color: 'var(--foreground)' }}>
        TechStore / Build v2.0.26
      </div>
    </div>
  );
}