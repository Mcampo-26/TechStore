"use client";

import React from 'react';
import { Laptop, Github, Instagram, Facebook, ArrowRight, MessageCircle } from 'lucide-react';
import Link from 'next/link';

export const Footer = () => {
  return (
    <footer className="bg-slate-950 text-slate-400 py-16 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">

          {/* COLUMNA 1: BRAND INFO */}
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-6 group">
              <div className="bg-blue-600 text-white p-2 rounded-xl">
                <Laptop size={20} />
              </div>
              <span className="text-xl font-black tracking-tighter text-white">
                TECH<span className="text-blue-600">STORE</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed mb-6">
              Llevando la tecnología del futuro a tu puerta. Equipamiento premium para desarrolladores, gamers y entusiastas.
            </p>
            
            {/* REDES SOCIALES CON COLORES DE MARCA */}
            <div className="flex gap-4">
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-[#1877F2] transition-all transform hover:-translate-y-1"
                title="Facebook"
              >
                <Facebook size={22} />
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-[#E4405F] transition-all transform hover:-translate-y-1"
                title="Instagram"
              >
                <Instagram size={22} />
              </a>
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-white transition-all transform hover:-translate-y-1"
                title="GitHub"
              >
                <Github size={22} />
              </a>
              <a 
                href="https://wa.me/tunúmero" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-[#25D366] transition-all transform hover:-translate-y-1"
                title="WhatsApp"
              >
                <MessageCircle size={22} />
              </a>
            </div>
          </div>

          {/* COLUMNA 2: NAVEGACIÓN */}
          <div>
            <h4 className="text-white font-bold mb-6 uppercase text-xs tracking-widest">Explorar</h4>
            <ul className="space-y-4 text-sm font-medium">
              <li><Link href="/" className="hover:text-white transition-colors">Inicio</Link></li>
              <li><Link href="/productos" className="hover:text-white transition-colors">Productos</Link></li>
              <li><Link href="/admin" className="hover:text-white transition-colors">Panel Admin</Link></li>
              <li><Link href="/#contacto" className="hover:text-white transition-colors">Contacto Directo</Link></li>
            </ul>
          </div>

          {/* COLUMNA 3: SOPORTE */}
          <div>
            <h4 className="text-white font-bold mb-6 uppercase text-xs tracking-widest">Soporte</h4>
            <ul className="space-y-4 text-sm font-medium">
              <li><Link href="/faq" className="hover:text-white transition-colors">Preguntas Frecuentes</Link></li>
              <li><Link href="/terms" className="hover:text-white transition-colors">Términos y Condiciones</Link></li>
              <li><Link href="/privacy" className="hover:text-white transition-colors">Política de Privacidad</Link></li>
              <li>
                <Link href="/contacto" className="text-blue-500 font-bold hover:text-blue-400 transition-colors">
                  Centro de Ayuda
                </Link>
              </li>
            </ul>
          </div>

          {/* COLUMNA 4: NEWSLETTER */}
          <div className="col-span-1 md:col-span-1">
            <h4 className="text-white font-bold mb-6 uppercase text-xs tracking-widest">Suscríbete</h4>
            <p className="text-sm mb-4">Recibe las últimas novedades tech y descuentos exclusivos.</p>
            <form className="relative group" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="tu@email.com"
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-600/50 focus:border-blue-600 transition-all"
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
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-[12px]">
          <p>© 2026 TechStore Inc. Todos los derechos reservados.</p>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_#22c55e]"></span>
            <span className="text-slate-500 font-mono tracking-tighter text-[10px]">SISTEMA OPERATIVO • TUCUMÁN, AR</span>
          </div>
        </div>
      </div>
    </footer>
  );
};