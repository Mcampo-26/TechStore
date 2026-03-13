"use client";

import React, { useEffect, useState } from 'react';
import { ShoppingCart, LogOut, User, Laptop, Menu, X, ShieldCheck, ChevronDown } from 'lucide-react'; 
import { useCartStore } from '@/store/useCartStore';
import { useAuthStore } from '@/store/useAuthStore';
import { useCategoryStore } from '@/store/useCategoryStore'; // Importamos el store
import { LoadingOverlay } from '@/components/ui/LoadingOverlay';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export const Navbar = () => {
  const router = useRouter();
  
  const cart = useCartStore((state) => state.cart);
  const { isLoggedIn, logout, user } = useAuthStore();
  const { categories, fetchCategories } = useCategoryStore(); // Consumimos categorías
  
  const [mounted, setMounted] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetchCategories(); // Cargamos categorías al montar el componente
  }, [fetchCategories]);

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
          
          {/* LOGO Y NOMBRE */}
          <div className="flex items-center gap-2 shrink-0">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="bg-blue-600 text-white p-2 rounded-xl group-hover:rotate-6 transition-transform">
                <Laptop size={22} />
              </div>
              <span className="text-xl font-black tracking-tighter text-slate-900 hidden sm:block">
                TECH<span className="text-blue-600">STORE</span>
              </span>
            </Link>

            <div className="md:hidden ml-2 pl-3 border-l border-gray-200">
              <span className="text-[12px] font-black uppercase tracking-tighter text-slate-900">
                TECH<span className="text-blue-600 ml-1">STORE</span>
              </span>
            </div>
          </div>

          {/* NAVEGACIÓN (Desktop) */}
          <ul className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
            <li><Link href="/" className="hover:text-blue-600 transition-colors">Inicio</Link></li>
            
            {/* CATEGORÍAS DESPLEGABLES DESKTOP */}
            <li className="relative group">
              <button className="flex items-center gap-1 hover:text-blue-600 transition-colors py-8">
                Productos <ChevronDown size={14} className="group-hover:rotate-180 transition-transform" />
              </button>
              
              <div className="absolute top-[70px] left-0 w-48 bg-white shadow-xl border border-gray-100 rounded-2xl p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform group-hover:translate-y-1">
                <Link href="/productos" className="block px-4 py-2 hover:bg-blue-50 rounded-xl text-xs font-bold text-blue-600 mb-1">
                  Ver Todo
                </Link>
                <div className="h-[1px] bg-gray-50 my-1" />
                {categories.map((cat: any) => (
                  <Link 
                    key={cat._id}
                    href={`/productos?categoria=${cat.name}`} 
                    className="block px-4 py-2 hover:bg-slate-50 rounded-xl text-xs text-slate-600 hover:text-blue-600 transition-colors"
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            </li>
            
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

          {/* ACCIONES (Login, Carrito, etc) */}
          <div className="flex items-center gap-2 sm:gap-4">
            {mounted && isLoggedIn ? (
              <div className="flex items-center gap-3">
                <span className="hidden lg:block text-xs font-bold text-slate-400 uppercase tracking-widest">
                  Hola, {user?.name?.split(' ')[0]}
                </span>
                <button onClick={handleLogout} className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors">
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <Link href="/login" className="flex items-center gap-2 px-3 py-2 text-slate-700 hover:bg-slate-100 rounded-xl transition-colors font-medium text-sm">
                <User size={20} />
                <span className="hidden sm:inline">Ingresar</span>
              </Link>
            )}

            <Link href="/cart" className="relative p-2.5 bg-slate-900 text-white rounded-xl hover:bg-blue-600 transition-all active:scale-95 shadow-md">
              <ShoppingCart size={20} />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">
                  {itemCount}
                </span>
              )}
            </Link>

            <button className="md:hidden p-2 text-slate-600" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* MENÚ DESPLEGABLE (Móvil) */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-gray-100 px-6 py-4 space-y-4 shadow-xl max-h-[80vh] overflow-y-auto">
            <Link href="/" className="block font-medium text-slate-600" onClick={() => setIsMobileMenuOpen(false)}>Inicio</Link>
            
            {/* SECCIÓN CATEGORÍAS MÓVIL */}
            <div className="space-y-2">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Categorías</p>
              <div className="grid grid-cols-2 gap-2">
                <Link 
                  href="/productos" 
                  className="text-sm font-bold text-blue-600 bg-blue-50 p-2 rounded-lg"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Ver Todo
                </Link>
                {categories.map((cat: any) => (
                  <Link 
                    key={cat._id}
                    href={`/productos?categoria=${cat.name}`}
                    className="text-sm text-slate-600 bg-slate-50 p-2 rounded-lg"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            </div>

            {isLoggedIn && (
              <Link href="/admin" className="flex items-center gap-2 font-bold text-blue-600 bg-blue-50 p-2 rounded-lg" onClick={() => setIsMobileMenuOpen(false)}>
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