"use client";

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Home, Construction, Cog } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#f4f7f9] flex items-center justify-center px-6 relative overflow-hidden">
      {/* Luces de fondo estilo Laboratorio */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-100/40 rounded-full blur-3xl animate-pulse" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-slate-200/50 rounded-full blur-3xl" />
      
      <div className="max-w-md w-full text-center z-10">
        <div className="flex justify-center mb-8 relative">
          {/* Engranajes girando detrás del icono */}
          <Cog size={100} className="absolute text-slate-200 animate-spin-slow opacity-50" style={{ animationDuration: '8s' }} />
          
          <div className="bg-white p-6 rounded-[2.5rem] shadow-xl shadow-blue-900/5 border border-white relative">
            <Construction size={48} className="text-blue-600" />
          </div>
        </div>

        <div className="inline-block bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-4">
          Status: 404_UNDER_CONSTRUCTION
        </div>

        <h1 className="text-4xl font-black text-slate-900 mb-2 tracking-tighter uppercase">
          Sección en construcción
        </h1>
        
        <p className="text-slate-500 text-sm font-medium mb-10 leading-relaxed">
          Nuestros ingenieros están ensamblando esta parte del sistema. ¡Vuelve pronto para ver las novedades!
        </p>

        <div className="flex flex-col gap-3">
          <Link href="/">
            <button className="w-full bg-[#1e293b] text-white py-4 rounded-2xl font-bold text-xs tracking-[0.2em] uppercase hover:bg-blue-600 transition-all shadow-lg shadow-blue-900/10 flex items-center justify-center gap-3 group">
              <Home size={16} />
              Volver al inicio
            </button>
          </Link>
          
          <button 
            onClick={() => window.history.back()}
            className="w-full bg-white text-slate-500 py-4 rounded-2xl font-bold text-xs tracking-[0.2em] uppercase border border-slate-200 hover:bg-slate-50 transition-all flex items-center justify-center gap-3 group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Regresar
          </button>
        </div>
      </div>

      {/* Grid de fondo muy sutil */}
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />

      <div className="absolute bottom-8 text-[9px] font-black text-slate-400 uppercase tracking-[0.4em]">
        TechStore / Build v2.0.26
      </div>
    </div>
  );
}