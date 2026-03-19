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
import { TechLoader } from '@/components/ui/TechLoader'; // Ajusta la ruta si es necesario
import { AnimatePresence } from 'framer-motion'; // Asegúrate de tener esto importado

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
 

  // CONFIGURACIÓN DE ALTURA MENÚ LATERAL
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
    
    // Simulamos una pequeña desconexión segura
    setTimeout(() => {
      logout();
      router.push('/');
      // No reseteamos setIsLoggingOut aquí porque al cambiar de página 
      // el componente se desmonta solo, pero si quieres asegurar:
      setTimeout(() => setIsLoggingOut(false), 500);
    }, 1500); 
  };

  return (
    <>
      {isLoggingOut && <LoadingOverlay message="Cerrando sesión..." />}
      <AnimatePresence>
      {isLoggingOut && <TechLoader mode="logout" />}
    </AnimatePresence>

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

          {/* CENTRO: NAVEGACIÓN + ADMIN + INGRESAR */}
          <div className="flex items-center">
            <ul className="hidden md:flex items-center gap-8 text-[10px] font-black uppercase tracking-[0.2em]">
              <li><Link href="/" className="hover:text-blue-600 transition-colors" style={{ color: isDarkMode ? '#f8fafc' : '#0f172a' }}>Inicio</Link></li>
              <li><Link href="/productos" className="hover:text-blue-600 transition-colors" style={{ color: isDarkMode ? '#f8fafc' : '#0f172a' }}>Productos</Link></li>
              
              {/* BOTÓN INGRESAR (Si no está logueado) */}
              {mounted && !isLoggedIn && (
                <li>
                  <Link href="/login" className="flex items-center gap-2 px-5 py-2 rounded-xl border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-300 font-black active:scale-95">
                    <User size={14} /> INGRESAR
                  </Link>
                </li>
              )}

              {/* BOTÓN ADMIN (Si está logueado) */}
              {mounted && isLoggedIn && (
                <li>
                  <Link href="/admin" className="group relative flex items-center gap-2 px-5 py-2.5 rounded-xl overflow-hidden transition-all duration-300 shadow-lg hover:shadow-blue-500/25 active:scale-95"
                    style={{ background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)' }}>
                    <ShieldCheck size={14} className="text-white" />
                    <span className="text-white font-black text-[9px]">PANEL ADMIN</span>
                  </Link>
                </li>
              )}
            </ul>

            {/* Saludo Mobile */}
            {mounted && isLoggedIn && (
              <div className="md:hidden flex flex-col items-center justify-center px-3 py-1 rounded-xl border border-blue-600/20 bg-blue-600/5">
                <span className="text-[9px] font-black uppercase text-blue-600">{user?.name?.split(' ')[0]}</span>
              </div>
            )}
          </div>

          {/* DERECHA: ICONOS + LOGOUT DESKTOP */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Toggle Tema */}
            <button onClick={toggleTheme} className="p-2.5 rounded-xl border transition-all active:scale-90"
              style={{ borderColor: isDarkMode ? '#1e293b' : '#f1f5f9', color: isDarkMode ? '#94a3b8' : '#64748b' }}>
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {/* Carrito */}
            <Link href="/cart" className="relative p-2.5 rounded-xl transition-all hover:bg-blue-600/10" style={{ color: isDarkMode ? '#f8fafc' : '#0f172a' }}>
              <ShoppingCart size={22} />
              {mounted && itemCount > 0 && (
                <span className="absolute top-1 right-1 bg-blue-600 text-white text-[9px] font-black min-w-[16px] h-4 flex items-center justify-center rounded-full px-1">
                  {itemCount}
                </span>
              )}
            </Link>

            {/* BOTÓN LOGOUT DESKTOP (Nuevo) */}
            {mounted && isLoggedIn && (
              <button 
                onClick={handleLogout}
                className="hidden md:flex items-center gap-2 p-2.5 rounded-xl text-red-500 hover:bg-red-500/10 transition-all active:scale-90 border border-transparent hover:border-red-500/20"
                title="Cerrar Sesión"
              >
                <LogOut size={22} />
              </button>
            )}

            {/* Menú Hamburguesa Mobile */}
            <button className="md:hidden p-2.5 rounded-xl bg-blue-600 text-white shadow-lg active:scale-95 transition-all" onClick={() => setIsMobileMenuOpen(true)}>
              <Menu size={22} />
            </button>
          </div>
        </div>
      </nav>

      {/* MENÚ LATERAL (SIDEBAR MOBILE) */}
      <div className={`fixed inset-0 z-[100] flex justify-end p-5 transition-all duration-500 ${isMobileMenuOpen ? 'visible' : 'invisible'}`}>
        <div className={`absolute inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity duration-500 ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0'}`} onClick={() => setIsMobileMenuOpen(false)} />

        <div className={`relative w-[320px] transition-all duration-500 flex flex-col rounded-[2rem] overflow-hidden ${isMobileMenuOpen ? 'translate-x-0 scale-100 opacity-100' : 'translate-x-10 scale-95 opacity-0'}`}
          style={{ backgroundColor: isDarkMode ? '#0f172a' : '#ffffff', border: `1px solid ${isDarkMode ? '#1e293b' : '#e2e8f0'}`, height: 'fit-content', maxHeight: sidebarMaxHeight }}>
          
          <div className="p-5 flex items-center justify-between border-b" style={{ borderColor: isDarkMode ? '#1e293b' : '#f1f5f9' }}>
            <span className="text-[11px] font-black uppercase tracking-[0.2em]" style={{ color: isDarkMode ? '#94a3b8' : '#64748b' }}>Menú</span>
            <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 rounded-full hover:bg-red-500/10 transition-colors" style={{ color: isDarkMode ? '#94a3b8' : '#64748b' }}><X size={20} /></button>
          </div>

          <div className="overflow-y-auto px-5 py-4 space-y-6">
            <div className="flex gap-3">
              <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="flex-1 py-3 rounded-2xl text-[10px] font-black uppercase text-center border" style={{ backgroundColor: isDarkMode ? '#1e293b' : '#f8fafc', borderColor: isDarkMode ? '#334155' : '#f1f5f9', color: isDarkMode ? '#f1f5f9' : '#1e293b' }}>Inicio</Link>
              <Link href="/productos" onClick={() => setIsMobileMenuOpen(false)} className="flex-1 py-3 rounded-2xl text-[10px] font-black uppercase text-center border" style={{ backgroundColor: isDarkMode ? '#1e293b' : '#f8fafc', borderColor: isDarkMode ? '#334155' : '#f1f5f9', color: isDarkMode ? '#f1f5f9' : '#1e293b' }}>Tienda</Link>
            </div>

            <div className="space-y-1">
              <span className="px-2 text-[9px] font-bold uppercase tracking-[0.3em] text-blue-500 mb-2 block">Categorías</span>
              {categories.map((cat: any) => (
                <button key={cat._id} onClick={() => handleCategoryAction(cat.name)} className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-blue-600/5 group transition-all text-left">
                  <span className="text-[12px] font-bold group-hover:text-blue-600" style={{ color: isDarkMode ? '#cbd5e1' : '#334155' }}>{cat.name}</span>
                  <ChevronRight size={16} className="text-blue-600 opacity-0 group-hover:opacity-100" />
                </button>
              ))}
            </div>
          </div>

          <div className="p-5 mt-auto border-t" style={{ backgroundColor: isDarkMode ? '#161e2f' : '#f8fafc', borderColor: isDarkMode ? '#1e293b' : '#f1f5f9' }}>
            {mounted && isLoggedIn ? (
              <div className="space-y-3">
                <Link href="/admin" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-center gap-3 py-4 rounded-2xl bg-blue-600 text-white font-black uppercase text-[10px] shadow-lg"><ShieldCheck size={16} /> Panel Admin</Link>
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