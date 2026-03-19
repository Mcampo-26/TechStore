"use client";

import React, { useEffect, useState } from 'react';
import {
  ShoppingCart, LogOut, Laptop, Menu, X,
  ShieldCheck, Sun, Moon, User, ChevronRight
} from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { useAuthStore } from '@/store/useAuthStore';
import { useProductStore } from '@/store/useProductStore';
import { LoadingOverlay } from '@/components/ui/LoadingOverlay';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';

interface NavbarProps {
  categories: any[];
}

export const Navbar = ({ categories }: NavbarProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const cart = useCartStore((state) => state.cart);
  const { isLoggedIn, logout, user } = useAuthStore();
  const filterByCategory = useProductStore((state) => state.filterByCategory);

  const [mounted, setMounted] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // --- CONFIGURACIÓN DE ALTURA ---
  // Cambia este valor (ej: '70vh', '90vh', 'fit-content') para ajustar el menú lateral
  const sidebarMaxHeight = '85vh'; 
  // -------------------------------

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem('theme');
    const isDark = savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches);
    if (isDark) {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    document.documentElement.classList.toggle('dark', newTheme);
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
  };

  const itemCount = mounted ? cart.reduce((acc, item) => acc + item.quantity, 0) : 0;

  const handleCategoryAction = (categoryName: string) => {
    filterByCategory(categoryName);
    if (pathname !== '/productos') router.push(`/productos?categoria=${encodeURIComponent(categoryName)}`);
    setIsMobileMenuOpen(false);
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    setIsMobileMenuOpen(false);
    setTimeout(() => {
      logout();
      router.push('/');
      setIsLoggingOut(false);
    }, 800);
  };

  return (
    <>
      {isLoggingOut && <LoadingOverlay message="Cerrando sesión..." />}

      {/* NAVBAR PRINCIPAL */}
      <nav 
        className="relative w-full z-40 border-b h-20 flex items-center shadow-sm transition-colors duration-300" 
        style={{ 
          backgroundColor: isDarkMode ? '#0f172a' : '#ffffff', 
          borderColor: isDarkMode ? '#1e293b' : '#f1f5f9' 
        }}
      >
        <div className="max-w-7xl mx-auto px-4 w-full flex items-center justify-between gap-4">

          {/* IZQUIERDA: LOGO + SALUDO DESKTOP */}
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2 group shrink-0">
              <div className="bg-blue-600 text-white p-2 rounded-xl shadow-lg shadow-blue-500/20 transition-transform group-hover:scale-105">
                <Laptop size={22} />
              </div>
              <span className="text-lg font-black tracking-tighter hidden sm:block uppercase" style={{ color: isDarkMode ? '#f8fafc' : '#0f172a' }}>
                TECH<span className="text-blue-600">STORE</span>
              </span>
            </Link>

            {mounted && isLoggedIn && (
              <div className="hidden md:flex flex-col border-l pl-6 border-slate-500/20 leading-tight">
                <span className="text-[8px] font-bold uppercase tracking-[0.2em] opacity-50" style={{ color: isDarkMode ? '#94a3b8' : '#64748b' }}>Bienvenido</span>
                <span className="text-[12px] font-black uppercase text-blue-600">{user?.name?.split(' ')[0]}</span>
              </div>
            )}
          </div>

          {/* CENTRO: NAVEGACIÓN + SALUDO MOBILE */}
          <div className="flex items-center">
            {mounted && isLoggedIn && (
              <div className="md:hidden flex flex-col items-center justify-center px-3 py-1 rounded-xl border border-blue-600/20 bg-blue-600/5">
                <span className="text-[7px] font-bold uppercase opacity-50 text-slate-500">Hola,</span>
                <span className="text-[9px] font-black uppercase text-blue-600 truncate max-w-[70px]">
                  {user?.name?.split(' ')[0]}
                </span>
              </div>
            )}

            <ul className="hidden md:flex items-center gap-8 text-[10px] font-black uppercase tracking-[0.2em]">
              <li><Link href="/" className="hover:text-blue-600 transition-colors" style={{ color: isDarkMode ? '#f8fafc' : '#0f172a' }}>Inicio</Link></li>
              <li><Link href="/productos" className="hover:text-blue-600 transition-colors" style={{ color: isDarkMode ? '#f8fafc' : '#0f172a' }}>Productos</Link></li>
              
              {mounted && isLoggedIn && (
                <li>
                <Link 
                  href="/admin" 
                  className="group relative flex items-center gap-2 px-5 py-2.5 rounded-xl overflow-hidden transition-all duration-300 shadow-lg hover:shadow-blue-500/25 active:scale-95"
                  style={{
                    background: isDarkMode 
                      ? 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)' 
                      : 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)'
                  }}
                >
                  {/* Efecto de brillo al pasar el mouse */}
                  <div className="absolute inset-0 w-full h-full bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  <ShieldCheck size={15} className="text-white animate-pulse group-hover:animate-none" />
                  <span className="relative text-white font-black text-[10px] tracking-[0.15em] uppercase">
                    Panel Admin
                  </span>
                </Link>
              </li>
              )}
            </ul>
          </div>

          {/* DERECHA: ICONOS */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <button 
              onClick={toggleTheme} 
              className="p-2.5 rounded-xl border transition-all active:scale-90"
              style={{ 
                borderColor: isDarkMode ? '#1e293b' : '#f1f5f9', 
                color: isDarkMode ? '#94a3b8' : '#64748b',
                backgroundColor: isDarkMode ? '#1e293b/30' : '#f8fafc'
              }}
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            <Link href="/cart" className="relative p-2.5 rounded-xl transition-all hover:bg-blue-600/10" style={{ color: isDarkMode ? '#f8fafc' : '#0f172a' }}>
              <ShoppingCart size={22} />
              {mounted && itemCount > 0 && (
                <span className="absolute top-1 right-1 bg-blue-600 text-white text-[9px] font-black min-w-[16px] h-4 flex items-center justify-center rounded-full px-1">
                  {itemCount}
                </span>
              )}
            </Link>

            <button className="md:hidden p-2.5 rounded-xl bg-blue-600 text-white shadow-lg active:scale-95 transition-all" onClick={() => setIsMobileMenuOpen(true)}>
              <Menu size={22} />
            </button>
          </div>
        </div>
      </nav>

      {/* MENÚ LATERAL */}
      <div className={`fixed inset-0 z-[100] flex justify-end p-5 transition-all duration-500 ${isMobileMenuOpen ? 'visible' : 'invisible'}`}>
        {/* Backdrop */}
        <div 
          className={`absolute inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity duration-500 ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0'}`} 
          onClick={() => setIsMobileMenuOpen(false)} 
        />

        {/* PANEL FLOTANTE */}
        <div 
          className={`relative w-[320px] transition-all duration-500 flex flex-col rounded-[2rem] overflow-hidden ${isMobileMenuOpen ? 'translate-x-0 scale-100 opacity-100' : 'translate-x-10 scale-95 opacity-0'}`}
          style={{ 
            backgroundColor: isDarkMode ? '#0f172a' : '#ffffff', 
            border: `1px solid ${isDarkMode ? '#1e293b' : '#e2e8f0'}`,
            height: 'fit-content', // Se adapta al contenido
            maxHeight: sidebarMaxHeight // Usamos la variable de arriba
          }}
        >
          {/* Header Menú */}
          <div className="p-5 flex items-center justify-between border-b" style={{ borderColor: isDarkMode ? '#1e293b' : '#f1f5f9' }}>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-5 bg-blue-600 rounded-full" />
              <span className="text-[11px] font-black uppercase tracking-[0.2em]" style={{ color: isDarkMode ? '#94a3b8' : '#64748b' }}>Menú</span>
            </div>
            <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 rounded-full hover:bg-red-500/10 transition-colors" style={{ color: isDarkMode ? '#94a3b8' : '#64748b' }}>
              <X size={20} />
            </button>
          </div>

          {/* Cuerpo Scroll */}
          <div className="overflow-y-auto px-5 py-4 space-y-6">
            <div className="flex gap-3">
              <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="flex-1 py-3 rounded-2xl text-[10px] font-black uppercase text-center border" style={{ backgroundColor: isDarkMode ? '#1e293b' : '#f8fafc', borderColor: isDarkMode ? '#334155' : '#f1f5f9', color: isDarkMode ? '#f1f5f9' : '#1e293b' }}>Inicio</Link>
              <Link href="/productos" onClick={() => setIsMobileMenuOpen(false)} className="flex-1 py-3 rounded-2xl text-[10px] font-black uppercase text-center border" style={{ backgroundColor: isDarkMode ? '#1e293b' : '#f8fafc', borderColor: isDarkMode ? '#334155' : '#f1f5f9', color: isDarkMode ? '#f1f5f9' : '#1e293b' }}>Tienda</Link>
            </div>

            <div className="space-y-1">
              <span className="px-2 text-[9px] font-bold uppercase tracking-[0.3em] text-blue-500 mb-2 block">Categorías</span>
              {categories.map((cat: any) => (
                <button key={cat._id} onClick={() => handleCategoryAction(cat.name)} className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-blue-600/5 group text-left transition-all">
                  <span className="text-[12px] font-bold group-hover:text-blue-600" style={{ color: isDarkMode ? '#cbd5e1' : '#334155' }}>{cat.name}</span>
                  <ChevronRight size={16} className="text-blue-600 opacity-0 group-hover:opacity-100 transition-all" />
                </button>
              ))}
            </div>
          </div>

          {/* Footer Menú (Botones de sesión) */}
          <div className="p-5 mt-auto border-t" style={{ backgroundColor: isDarkMode ? '#161e2f' : '#f8fafc', borderColor: isDarkMode ? '#1e293b' : '#f1f5f9' }}>
            {mounted && isLoggedIn ? (
              <div className="space-y-3">
                <Link href="/admin" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-center gap-3 py-4 rounded-2xl bg-blue-600 text-white font-black uppercase text-[10px] shadow-lg">
                  <ShieldCheck size={16} /> Panel Admin
                </Link>
                <button onClick={handleLogout} className="w-full py-2 text-[10px] font-black uppercase text-red-500 hover:text-red-600">Cerrar Sesión</button>
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