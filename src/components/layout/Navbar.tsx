"use client";

import React, { useEffect, useState } from 'react';
import { ShoppingCart, LogOut, User, Laptop, Menu, X, ShieldCheck } from 'lucide-react'; 
import { useCartStore } from '@/store/useCartStore';
import { useAuthStore } from '@/store/useAuthStore';
import { LoadingOverlay } from '@/components/ui/LoadingOverlay';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export const Navbar = () => {
  const router = useRouter();
  
  const cart = useCartStore((state) => state.cart);
  const { isLoggedIn, logout, user } = useAuthStore();
  
  const [mounted, setMounted] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const itemCount = (mounted && isLoggedIn) 
    ? cart.reduce((acc, item) => acc + item.quantity, 0) 
    : 0;

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

      <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-md z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between gap-4">
          
          {/* LOGO Y NOMBRE (Visible en todas las páginas) */}
          <div className="flex items-center gap-2 shrink-0">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="bg-blue-600 text-white p-2 rounded-xl group-hover:rotate-6 transition-transform">
                <Laptop size={22} />
              </div>
              {/* Desktop Name */}
              <span className="text-xl font-black tracking-tighter text-slate-900 hidden sm:block">
                TECH<span className="text-blue-600">STORE</span>
              </span>
            </Link>

            {/* Mobile Brand Name - SIEMPRE VISIBLE */}
            <div className="md:hidden ml-2 pl-3 border-l border-gray-200">
              <span className="text-[12px] font-black uppercase tracking-tighter text-slate-900">
                TECH<span className="text-blue-600 ml-1">STORE</span>
              </span>
            </div>
          </div>

          {/* NAVEGACIÓN (Desktop) */}
          <ul className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
            <li><Link href="/" className="hover:text-blue-600 transition-colors">Inicio</Link></li>
            <li><Link href="/productos" className="hover:text-blue-600 transition-colors">Productos</Link></li>
            
            {mounted && isLoggedIn && (
              <li>
                <Link 
                  href="/admin" 
                  className="flex items-center gap-1.5 text-blue-600 hover:text-blue-700 transition-colors bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100"
                >
                  <ShieldCheck size={16} />
                  Panel Admin
                </Link>
              </li>
            )}
          </ul>

          {/* ACCIONES */}
          <div className="flex items-center gap-2 sm:gap-4">
            
            {mounted && isLoggedIn ? (
              <div className="flex items-center gap-3">
                <span className="hidden lg:block text-xs font-bold text-slate-400 uppercase tracking-widest">
                  Hola, {user?.name?.split(' ')[0]}
                </span>
                <button 
                  onClick={handleLogout}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                  title="Cerrar Sesión"
                >
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <Link 
                href="/login"
                className="flex items-center gap-2 px-3 py-2 text-slate-700 hover:bg-slate-100 rounded-xl transition-colors font-medium text-sm"
              >
                <User size={20} />
                <span className="hidden sm:inline">Ingresar</span>
              </Link>
            )}

            <Link 
              href="/cart" 
              className="relative p-2.5 bg-slate-900 text-white rounded-xl hover:bg-blue-600 transition-all active:scale-95 shadow-md"
            >
              <ShoppingCart size={20} />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">
                  {itemCount}
                </span>
              )}
            </Link>

            <button 
              className="md:hidden p-2 text-slate-600"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* MENÚ DESPLEGABLE (Móvil) */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-gray-100 px-6 py-4 space-y-4 shadow-xl">
            <Link href="/" className="block font-medium text-slate-600" onClick={() => setIsMobileMenuOpen(false)}>Inicio</Link>
            <Link href="/productos" className="block font-medium text-slate-600" onClick={() => setIsMobileMenuOpen(false)}>Productos</Link>
            
            {isLoggedIn && (
              <Link 
                href="/admin" 
                className="flex items-center gap-2 font-bold text-blue-600 bg-blue-50 p-2 rounded-lg" 
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <ShieldCheck size={18} /> Panel Admin
              </Link>
            )}

            {!isLoggedIn && (
              <Link href="/login" className="block font-medium text-slate-600" onClick={() => setIsMobileMenuOpen(false)}>Ingresar</Link>
            )}
          </div>
        )}
      </nav>
    </>
  );
};