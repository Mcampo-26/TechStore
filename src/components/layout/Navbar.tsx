"use client";

import React, { useEffect, useState } from 'react';
import {
  ShoppingCart, LogOut, Laptop, Menu, X,
  ShieldCheck, Sun, Moon, User, ChevronRight, Flame
} from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { useAuthStore } from '@/store/useAuthStore';
import { useProductStore } from '@/store/useProductStore';

import Link from 'next/link';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { TechLoader } from '@/components/ui/TechLoader';
import { AnimatePresence } from 'framer-motion';

export const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const cart = useCartStore((state) => state.cart);
  const { isLoggedIn, logout, user } = useAuthStore();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const clearFilters = useProductStore((state) => state.clearFilters);

  const [mounted, setMounted] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const searchParams = useSearchParams();
  const isOffersActive = pathname === '/productos' && searchParams.get('oferta') === 'true';
  const sidebarMaxHeight = '85vh';

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem('theme');
    const isDark = savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches);
    if (isDark) {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const handleGoHome = () => {
    clearFilters();
    setIsMobileMenuOpen(false);
    router.push('/');
  };

  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    document.documentElement.classList.toggle('dark', newTheme);
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
  };

  const itemCount = mounted ? cart.reduce((acc, item) => acc + item.quantity, 0) : 0;

  const handleOffersAction = () => {
    setIsMobileMenuOpen(false);
    router.push(`/productos?oferta=true`);
  };

  const handleAdminClick = () => {
    const isAdminEmail = user?.email === "admin@engine.com";
    const isAdminId = user?.id === "69b22b47d965c2be83a91798";

    if (isAdminEmail || isAdminId) {
      document.cookie = "session=true; path=/; max-age=3600; SameSite=Lax";
      router.push('/admin/dashboard');
    } else {
      console.error("❌ No tienes permisos de super-usuario.");
    }
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    setIsMobileMenuOpen(false);
    setTimeout(() => {
      logout();
      router.push('/');
      setTimeout(() => setIsLoggingOut(false), 500);
    }, 1500);
  };

  return (
    <>
      <AnimatePresence>
        {isLoggingOut && <TechLoader mode="logout" />}
      </AnimatePresence>
      
      <nav
        className="relative w-full z-40 border-b h-20 flex items-center shadow-sm transition-colors duration-300"
        style={{
          backgroundColor: isDarkMode ? '#0f172a' : '#ffffff',
          borderColor: isDarkMode ? '#1e293b' : '#f1f5f9'
        }}
      >
        <div className="max-w-7xl mx-auto px-4 w-full flex items-center justify-between gap-4">

          {/* IZQUIERDA: LOGO */}
          <div className="flex items-center gap-6">
            <button onClick={handleGoHome} className="flex items-center gap-2 group shrink-0 focus:outline-none">
              <div className="bg-blue-600 text-white p-2 rounded-xl shadow-lg shadow-blue-500/20 transition-transform group-hover:scale-105">
                <Laptop size={22} />
              </div>
              <span className="text-lg font-black tracking-tighter hidden sm:block uppercase" style={{ color: isDarkMode ? '#f8fafc' : '#0f172a' }}>
                TECH<span className="text-blue-600">STORE</span>
              </span>
            </button>

            {mounted && isLoggedIn && (
              <div className="hidden lg:flex flex-col border-l pl-6 border-slate-500/20 leading-tight">
                <span className="text-[8px] font-bold uppercase tracking-[0.2em] opacity-50" style={{ color: isDarkMode ? '#94a3b8' : '#64748b' }}>Bienvenido</span>
                <span className="text-[12px] font-black uppercase text-blue-600">{user?.name?.split(' ')[0]}</span>
              </div>
            )}
          </div>

          {/* CENTRO: NAVEGACIÓN DESKTOP */}
          <div className="flex items-center">
            <ul className="hidden md:flex items-center gap-6 text-[10px] font-black uppercase tracking-[0.2em]">
              <li>
                <button onClick={handleGoHome} className="hover:text-blue-600 transition-colors" style={{ color: isDarkMode ? '#f8fafc' : '#0f172a' }}>
                  Inicio
                </button>
              </li>

              {/* BOTÓN OFERTAS */}
              <li>
                <button
                  onClick={handleOffersAction}
                  className={`group relative flex items-center gap-2.5 px-6 py-2.5 rounded-xl transition-all duration-500 overflow-hidden border-2 ${isOffersActive
                    ? 'bg-orange-600 shadow-[0_0_25px_rgba(249,115,22,0.6)] border-orange-400'
                    : isDarkMode
                      ? 'bg-slate-900 border-orange-500/40 hover:border-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.1)]'
                      : 'bg-orange-50 border-orange-200 hover:border-orange-500 shadow-sm'
                    }`}
                >
                  <div className="relative flex items-center gap-2 z-10">
                    <Flame size={18} className={`${isOffersActive ? 'text-white' : 'text-orange-500 animate-bounce'}`} fill="currentColor" />
                    <span className={`text-[12px] font-black uppercase tracking-[0.2em] italic ${isOffersActive ? 'text-white' : 'text-orange-600'}`}>
                      Ofertas
                    </span>
                  </div>
                  <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full animate-[shimmer_3s_infinite] pointer-events-none" />
                </button>
              </li>

              {/* PANEL ADMIN */}
              {mounted && isLoggedIn && (
                <li>
                  <button 
                    onClick={handleAdminClick}
                    className="group relative flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all duration-300 shadow-lg hover:shadow-blue-500/25 active:scale-95 text-white font-black text-[9px] overflow-hidden"
                    style={{ background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)' }}
                  >
                    <ShieldCheck size={14} className="relative z-10" />
                    <span className="relative z-10 uppercase">Panel Admin</span>
                  </button>
                </li>
              )}

              {mounted && !isLoggedIn && (
                <li>
                  <Link href="/login" className="flex items-center gap-2 px-5 py-2 rounded-xl border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-300 font-black">
                    <User size={14} /> INGRESAR
                  </Link>
                </li>
              )}
            </ul>
          </div>

          {/* DERECHA: ICONOS */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <button onClick={toggleTheme} className="p-2.5 rounded-xl border transition-all" style={{ borderColor: isDarkMode ? '#1e293b' : '#f1f5f9', color: isDarkMode ? '#94a3b8' : '#64748b' }}>
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            <Link href="/cart" className="relative p-2.5 rounded-xl transition-all hover:bg-blue-600/5" style={{ color: isDarkMode ? '#f8fafc' : '#0f172a' }}>
              <ShoppingCart size={22} />
              {mounted && itemCount > 0 && (
                <span className="absolute top-1 right-1 bg-blue-600 text-white text-[9px] font-black min-w-[16px] h-4 flex items-center justify-center rounded-full px-1">
                  {itemCount}
                </span>
              )}
            </Link>

            {mounted && isLoggedIn && (
              <button onClick={handleLogout} className="hidden md:flex items-center gap-2 p-2.5 rounded-xl text-red-500 hover:bg-red-500/10 transition-all">
                <LogOut size={22} />
              </button>
            )}

            <button className="md:hidden p-2.5 rounded-xl bg-blue-600 text-white shadow-lg" onClick={() => setIsMobileMenuOpen(true)}>
              <Menu size={22} />
            </button>
          </div>
        </div>
      </nav>

      {/* MENÚ LATERAL MOBILE (Simplificado sin categorías) */}
      <div className={`fixed inset-0 z-[100] flex justify-end p-5 transition-all duration-500 ${isMobileMenuOpen ? 'visible' : 'invisible'}`}>
        <div className={`absolute inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity duration-500 ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0'}`} onClick={() => setIsMobileMenuOpen(false)} />

        <div className={`relative w-[320px] transition-all duration-500 flex flex-col rounded-[2rem] overflow-hidden ${isMobileMenuOpen ? 'translate-x-0 scale-100' : 'translate-x-10 scale-95 opacity-0'}`}
          style={{ backgroundColor: isDarkMode ? '#0f172a' : '#ffffff', maxHeight: sidebarMaxHeight }}>

          <div className="p-5 flex items-center justify-between border-b" style={{ borderColor: isDarkMode ? '#1e293b' : '#f1f5f9' }}>
            <span className="text-[11px] font-black uppercase tracking-[0.2em]" style={{ color: isDarkMode ? '#94a3b8' : '#64748b' }}>Menú</span>
            <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 rounded-full hover:bg-red-500/10"><X size={20} /></button>
          </div>

          <div className="p-5 space-y-4">
            <button onClick={handleOffersAction} className="w-full flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg">
              <div className="flex items-center gap-3">
                <Flame size={18} />
                <span className="text-[11px] font-black uppercase tracking-widest">Ofertas Hot</span>
              </div>
              <ChevronRight size={18} />
            </button>
            
            <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="block p-3 text-[12px] font-bold" style={{ color: isDarkMode ? '#cbd5e1' : '#334155' }}>Inicio</Link>
            <Link href="/productos" onClick={() => setIsMobileMenuOpen(false)} className="block p-3 text-[12px] font-bold" style={{ color: isDarkMode ? '#cbd5e1' : '#334155' }}>Todos los productos</Link>
          </div>

          <div className="p-5 mt-auto border-t" style={{ backgroundColor: isDarkMode ? '#161e2f' : '#f8fafc', borderColor: isDarkMode ? '#1e293b' : '#f1f5f9' }}>
            {mounted && isLoggedIn ? (
              <div className="space-y-3">
                <button onClick={handleAdminClick} className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl bg-blue-600 text-white font-black uppercase text-[10px]"><ShieldCheck size={16} /> Panel Admin</button>
                <button onClick={handleLogout} className="w-full py-2 text-[10px] font-black uppercase text-red-500">Cerrar Sesión</button>
              </div>
            ) : (
              <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-center py-4 rounded-2xl bg-blue-600 text-white font-black uppercase text-[10px]">Entrar</Link>
            )}
          </div>
        </div>
      </div>
    </>
  );
};