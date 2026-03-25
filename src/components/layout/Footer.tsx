"use client";

import React from 'react';
import Link from 'next/link';
import { Laptop, Github, Instagram, Facebook, MessageCircle } from 'lucide-react';
import { useProductStore } from "@/store/useProductStore";

export const Footer = () => {
  const setLoading = useProductStore((state) => state.setLoading);

  // Función reutilizable para activar el loader en cada navegación
  const handleNav = () => setLoading(true);

  return (
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
            <Link href="/" onClick={handleNav} className="flex items-center gap-2 mb-6 group">
              <div className="bg-blue-600 text-white p-2 rounded-xl group-hover:scale-110 transition-transform">
                <Laptop size={20} />
              </div>
              <span className="text-xl font-black tracking-tighter uppercase">
                TECH<span className="text-blue-600">STORE</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed mb-6 opacity-60 font-medium">
              Llevando la tecnología del futuro a tu puerta. Equipamiento premium para desarrolladores, gamers y entusiastas.
            </p>
            
            <div className="flex gap-4">
              <a href="#" className="opacity-60 hover:opacity-100 hover:text-[#1877F2] transition-all transform hover:-translate-y-1">
                <Facebook size={20} />
              </a>
              <a href="#" className="opacity-60 hover:opacity-100 hover:text-[#E4405F] transition-all transform hover:-translate-y-1">
                <Instagram size={20} />
              </a>
              <a href="#" className="opacity-60 hover:opacity-100 hover:text-white transition-all transform hover:-translate-y-1">
                <Github size={20} />
              </a>
              <a href="#" className="opacity-60 hover:opacity-100 hover:text-[#25D366] transition-all transform hover:-translate-y-1">
                <MessageCircle size={20} />
              </a>
            </div>
          </div>

          {/* COLUMNA 2: NAVEGACIÓN */}
          <div>
            <h4 className="font-bold mb-6 uppercase text-[10px] tracking-[0.2em] opacity-90 text-blue-600">Explorar</h4>
            <ul className="space-y-4 text-sm font-semibold opacity-70">
              <li><Link href="/" onClick={handleNav} className="hover:text-blue-600 transition-colors">Inicio</Link></li>
              <li><Link href="/productos" onClick={handleNav} className="hover:text-blue-600 transition-colors">Productos</Link></li>
              <li><Link href="/admin" onClick={handleNav} className="hover:text-blue-600 transition-colors">Panel Admin</Link></li>
              <li><Link href="/contacto" onClick={handleNav} className="hover:text-blue-600 transition-colors">Contacto Directo</Link></li>
            </ul>
          </div>

          {/* COLUMNA 3: SOPORTE (REDIRIGIDAS A PÁGINA REAL /NOT-FOUND) */}
          <div>
            <h4 className="font-bold mb-6 uppercase text-[10px] tracking-[0.2em] opacity-90 text-blue-600">Soporte</h4>
            <ul className="space-y-4 text-sm font-semibold opacity-70">
              {/* Ahora que /not-found es una ruta física, el spinner se activará aquí y se apagará en el page.tsx */}
              <li><Link href="/not-found" onClick={handleNav} className="hover:text-blue-600 transition-colors">Preguntas Frecuentes</Link></li>
              <li><Link href="/not-found" onClick={handleNav} className="hover:text-blue-600 transition-colors">Términos y Condiciones</Link></li>
              <li><Link href="/not-found" onClick={handleNav} className="hover:text-blue-600 transition-colors">Política de Privacidad</Link></li>
              <li>
                <Link href="/contacto" onClick={handleNav} className="text-blue-600 font-bold hover:underline">
                  Centro de Ayuda
                </Link>
              </li>
            </ul>
          </div>

          {/* COLUMNA 4: NEWSLETTER */}
          <div className="col-span-1 md:col-span-1">
            <h4 className="font-bold mb-6 uppercase text-[10px] tracking-[0.2em] opacity-90 text-blue-600">Suscríbete</h4>
            <p className="text-sm mb-4 opacity-60 font-medium">Recibe las últimas novedades tech y descuentos exclusivos.</p>
            <div className="flex gap-2">
               <div className="h-10 w-full bg-[var(--card-bg)] border border-[var(--border-theme)] rounded-xl opacity-50" />
            </div>
          </div>

        </div>

        {/* BARRA INFERIOR */}
        <div 
          className="pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] opacity-40 font-bold uppercase tracking-widest"
          style={{ borderColor: 'var(--border-theme)' }}
        >
          <p>© 2026 TechStore Inc. Todos los derechos reservados.</p>
          <div className="flex items-center gap-3">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_#22c55e]"></span>
            <span className="font-mono tracking-tighter">Sistema Online • Prototipo V1.0</span>
          </div>
        </div>
      </div>
    </footer>
  );
};