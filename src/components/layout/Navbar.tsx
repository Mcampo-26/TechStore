"use client";

import React, { useEffect, useState } from 'react';
import { ShoppingCart, LogOut, User, Laptop, Menu, X, ShieldCheck, ChevronDown, Sun, Moon, LayoutDashboard } from 'lucide-react'; 
import { useCartStore } from '@/store/useCartStore';
import { useAuthStore } from '@/store/useAuthStore';
import { LoadingOverlay } from '@/components/ui/LoadingOverlay';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface NavbarProps {
  categories: any[];
}

export const Navbar = ({ categories }: NavbarProps) => {
  const router = useRouter();
  const cart = useCartStore((state) => state.cart);
  const { isLoggedIn, logout, user } = useAuthStore(); // Traemos 'user' para validar rol si fuera necesario
  
  const [mounted, setMounted] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

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
    if (newTheme) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const itemCount = mounted ? cart.reduce((acc, item) => acc + item.quantity, 0) : 0;

  const handleLogout = async () => {
    setIsLoggingOut(true);
    setTimeout(() => {
      logout(); 
      router.push('/');
      router.refresh();
      setIsLoggingOut(false);
      setIsMobileMenuOpen(false);
    }, 800);
  };

  return (
    <>
      {isLoggingOut && <LoadingOverlay message="Cerrando sesión..." />}

      <nav 
        className="fixed top-0 w-full backdrop-blur-md z-50 border-b transition-colors duration-300 h-20 flex items-center glass-effect"
        style={{ 
          backgroundColor: 'var(--nav-bg)', 
          borderColor: 'var(--border-theme)' 
        }}
      >
        <div className="max-w-7xl mx-auto px-6 w-full flex items-center justify-between gap-4">
          
          {/* LOGO */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="bg-blue-600 text-white p-2 rounded-xl group-hover:rotate-6 transition-transform shadow-lg shadow-blue-500/20">
              <Laptop size={22} />
            </div>
            <span className="text-xl font-black tracking-tighter hidden sm:block uppercase" style={{ color: 'var(--foreground)' }}>
              TECH<span className="text-blue-600">STORE</span>
            </span>
          </Link>

          {/* NAVEGACIÓN DESKTOP */}
          <ul className="hidden md:flex items-center gap-8 text-[10px] font-black uppercase tracking-widest">
            <li>
              <Link href="/" className="hover:text-blue-600 transition-colors" style={{ color: 'var(--foreground)' }}>
                Inicio
              </Link>
            </li>
            <li className="relative group">
              <button className="flex items-center gap-1 hover:text-blue-600 transition-colors py-4 uppercase cursor-pointer" style={{ color: 'var(--foreground)' }}>
                Productos <ChevronDown size={14} className="group-hover:rotate-180 transition-transform" />
              </button>
              
              <div 
                className="absolute top-full left-0 w-64 shadow-2xl border rounded-2xl p-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all translate-y-2 group-hover:translate-y-0 glass-effect"
                style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-theme)' }}
              >
                <Link href="/productos" className="block px-4 py-3 bg-blue-600 text-white rounded-xl text-[10px] font-black mb-3 transition-all hover:bg-blue-700 text-center uppercase tracking-tighter shadow-md">
                  Ver todo el catálogo
                </Link>
                
                <div className="h-px w-full my-2 opacity-10" style={{ backgroundColor: 'var(--foreground)' }} />
                
                <div className="max-h-64 overflow-y-auto custom-scrollbar flex flex-col gap-1.5 p-1">
                  {categories.map((cat: any) => (
                    <Link 
                      key={cat._id} 
                      href={`/productos?categoria=${encodeURIComponent(cat.name)}`} 
                      className="block px-4 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-tight transition-all border border-transparent hover:border-blue-600/30 hover:bg-blue-600/10 hover:text-blue-600 dark:hover:text-blue-500" 
                      style={{ color: 'var(--foreground)' }}
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              </div>
            </li>

            {/* BOTÓN ADMIN DESKTOP */}
            {mounted && isLoggedIn && (
              <li>
                <Link 
                  href="/admin" 
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all text-[10px] font-black uppercase tracking-tighter bg-amber-500/10 text-amber-600 border-amber-600/20 hover:bg-amber-600 hover:text-white"
                >
                  <ShieldCheck size={14} />
                  Panel Admin
                </Link>
              </li>
            )}
          </ul>

          {/* ACCIONES */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button 
              onClick={toggleTheme}
              className="p-2.5 rounded-xl transition-all border hover:border-blue-600 hover:text-blue-600 cursor-pointer"
              style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border-theme)', color: 'var(--foreground)' }}
            >
              {!mounted ? <div className="w-[18px] h-[18px]" /> : (isDarkMode ? <Sun size={18} /> : <Moon size={18} />)}
            </button>

            {mounted && isLoggedIn ? (
              <button onClick={handleLogout} className="p-2.5 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-all border border-transparent hover:border-red-600 cursor-pointer">
                <LogOut size={18} />
              </button>
            ) : (
              <Link href="/login" className="flex items-center gap-2 px-4 py-2.5 hover:bg-blue-600 hover:text-white rounded-xl transition-all font-black text-[10px] uppercase border"
                    style={{ borderColor: 'var(--border-theme)', color: 'var(--foreground)' }}>
                <User size={18} />
                <span className="hidden sm:inline">Ingresar</span>
              </Link>
            )}

            <Link 
              href="/cart" 
              className="relative p-2.5 flex items-center justify-center rounded-xl transition-all hover:bg-blue-600/10 group"
              style={{ color: 'var(--foreground)' }}
            >
              <ShoppingCart size={22} className="group-hover:text-blue-600 transition-colors" />
              {mounted && itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full border-2 shadow-sm animate-in zoom-in"
                      style={{ borderColor: 'var(--nav-bg)' }}>
                  {itemCount}
                </span>
              )}
            </Link>

            <button 
              className="md:hidden p-2.5 rounded-xl border transition-all active:scale-95 cursor-pointer" 
              style={{ borderColor: 'var(--border-theme)', color: 'var(--foreground)' }}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </nav>
      
      {/* MENÚ MÓVIL */}
      <div className={`md:hidden fixed inset-0 z-[60] transition-all duration-300 ${isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
        
        <div 
          className={`absolute right-0 top-0 h-full w-[300px] shadow-2xl transition-transform duration-500 p-8 flex flex-col gap-6 ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'} glass-effect`}
          style={{ backgroundColor: 'var(--card-bg)' }}
        >
          <div className="flex justify-between items-center mb-4">
            <span className="text-xs font-black uppercase tracking-widest text-blue-600">Menú</span>
            <button onClick={() => setIsMobileMenuOpen(false)} className="p-2"><X size={24} style={{ color: 'var(--foreground)' }} /></button>
          </div>

          <div className="flex flex-col gap-4">
            <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="text-sm font-black uppercase tracking-widest" style={{ color: 'var(--foreground)' }}>Inicio</Link>
            
            <div className="h-px w-full bg-gray-500/10" />

            {/* BOTÓN ADMIN MOBILE */}
            {mounted && isLoggedIn && (
              <Link 
                href="/admin" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 p-4 rounded-2xl bg-amber-500/10 text-amber-600 border border-amber-600/20 text-xs font-black uppercase tracking-widest"
              >
                <LayoutDashboard size={20} />
                Panel de Control
              </Link>
            )}

            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mt-4">Categorías</span>
            <div className="grid grid-cols-1 gap-2">
              {categories.map((cat: any) => (
                <Link 
                  key={cat._id} 
                  href={`/productos?categoria=${encodeURIComponent(cat.name)}`} 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-3 rounded-xl border border-transparent hover:border-blue-600/30 hover:bg-blue-600/5 text-[11px] font-bold uppercase transition-all"
                  style={{ color: 'var(--foreground)' }}
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Logout Mobile */}
          {mounted && isLoggedIn && (
            <button 
              onClick={handleLogout}
              className="mt-auto flex items-center justify-center gap-2 p-4 rounded-2xl bg-red-500/10 text-red-500 border border-red-500/20 font-black uppercase text-xs tracking-widest"
            >
              <LogOut size={18} /> Cerrar Sesión
            </button>
          )}
        </div>
      </div>

      <div className="h-20" />
    </>
  );
};