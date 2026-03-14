"use client";

import React from 'react';
import { Laptop, Github, Instagram, Facebook, ArrowRight, MessageCircle } from 'lucide-react';
import Link from 'next/link';

export const Footer = () => {
  return (
    /* CAMBIO 1: Usamos var(--nav-bg) o un tono oscuro coherente que se adapte ligeramente */
    <footer 
      className="py-16 border-t transition-colors duration-300"
      style={{ 
        backgroundColor: 'var(--nav-bg)', 
        borderColor: 'var(--border-theme)',
        color: 'var(--foreground)'
      }}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">

          {/* COLUMNA 1: BRAND INFO */}
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-6 group">
              <div className="bg-blue-600 text-white p-2 rounded-xl">
                <Laptop size={20} />
              </div>
              <span className="text-xl font-black tracking-tighter">
                TECH<span className="text-blue-600">STORE</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed mb-6 opacity-70">
              Llevando la tecnología del futuro a tu puerta. Equipamiento premium para desarrolladores, gamers y entusiastas.
            </p>
            
            {/* REDES SOCIALES */}
            <div className="flex gap-4">
              <a href="#" className="opacity-70 hover:opacity-100 hover:text-[#1877F2] transition-all transform hover:-translate-y-1">
                <Facebook size={22} />
              </a>
              <a href="#" className="opacity-70 hover:opacity-100 hover:text-[#E4405F] transition-all transform hover:-translate-y-1">
                <Instagram size={22} />
              </a>
              <a href="#" className="opacity-70 hover:opacity-100 hover:text-blue-500 transition-all transform hover:-translate-y-1">
                <Github size={22} />
              </a>
              <a href="#" className="opacity-70 hover:opacity-100 hover:text-[#25D366] transition-all transform hover:-translate-y-1">
                <MessageCircle size={22} />
              </a>
            </div>
          </div>

          {/* COLUMNA 2: NAVEGACIÓN */}
          <div>
            <h4 className="font-bold mb-6 uppercase text-xs tracking-widest opacity-90">Explorar</h4>
            <ul className="space-y-4 text-sm font-medium opacity-70">
              <li><Link href="/" className="hover:text-blue-600 transition-colors">Inicio</Link></li>
              <li><Link href="/productos" className="hover:text-blue-600 transition-colors">Productos</Link></li>
              <li><Link href="/admin" className="hover:text-blue-600 transition-colors">Panel Admin</Link></li>
              <li><Link href="/contacto" className="hover:text-blue-600 transition-colors">Contacto Directo</Link></li>
            </ul>
          </div>

          {/* COLUMNA 3: SOPORTE */}
          <div>
            <h4 className="font-bold mb-6 uppercase text-xs tracking-widest opacity-90">Soporte</h4>
            <ul className="space-y-4 text-sm font-medium opacity-70">
              <li><Link href="/faq" className="hover:text-blue-600 transition-colors">Preguntas Frecuentes</Link></li>
              <li><Link href="/terms" className="hover:text-blue-600 transition-colors">Términos y Condiciones</Link></li>
              <li><Link href="/privacy" className="hover:text-blue-600 transition-colors">Política de Privacidad</Link></li>
              <li>
                <Link href="/contacto" className="text-blue-600 font-bold hover:underline">
                  Centro de Ayuda
                </Link>
              </li>
            </ul>
          </div>

          {/* COLUMNA 4: NEWSLETTER */}
          <div className="col-span-1 md:col-span-1">
            <h4 className="font-bold mb-6 uppercase text-xs tracking-widest opacity-90">Suscríbete</h4>
            <p className="text-sm mb-4 opacity-70">Recibe las últimas novedades tech y descuentos exclusivos.</p>
            <form className="relative group" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="tu@email.com"
                className="w-full rounded-xl py-3 px-4 text-sm transition-all border outline-none focus:ring-2 focus:ring-blue-600/30"
                style={{ 
                  backgroundColor: 'var(--background)', 
                  borderColor: 'var(--border-theme)',
                  color: 'var(--foreground)'
                }}
              />
              <button 
                type="submit"
                className="absolute right-2 top-1.5 p-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors"
              >
                <ArrowRight size={18} />
              </button>
            </form>
          </div>

        </div>

        {/* BARRA INFERIOR */}
        <div 
          className="pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-4 text-[12px] opacity-60"
          style={{ borderColor: 'var(--border-theme)' }}
        >
          <p>© 2026 TechStore Inc. Todos los derechos reservados.</p>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_#22c55e]"></span>
            <span className="font-mono tracking-tighter text-[10px] uppercase">Sistema Online • Tucumán, AR</span>
          </div>
        </div>
      </div>
    </footer>
  );
};