"use client";

import React, { useEffect, useState } from 'react';
import {
  ShoppingCart, LogOut, Laptop, Menu, X,
  ShieldCheck, Sun, Database, Moon, ChevronRight,
  LayoutDashboard, PackagePlus, History, LogIn, Users, Settings2
} from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { useAuthStore } from '@/store/useAuthStore';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { TechLoader } from '@/components/ui/TechLoader';
import { AnimatePresence, motion } from 'framer-motion';

// --- CONFIGURACIÓN DE RUTAS ---
const ADMIN_ROUTES = [
  { name: 'Dash', href: '/admin/dashboard', icon: LayoutDashboard, color: 'text-blue-500', permission: 'viewDashboard' },
  { name: 'Usuarios', href: '/admin/usuarios', icon: Users, color: 'text-indigo-400', permission: 'viewUsuarios' },
  { name: 'Roles', href: '/admin/roles', icon: Settings2, color: 'text-orange-400', permission: 'viewRoles' },
  { name: 'Stock', href: '/admin/inventory', icon: Database, color: 'text-cyan-400', permission: 'viewStock' },
  { name: 'Carga', href: '/admin/stock', icon: PackagePlus, color: 'text-emerald-400', permission: 'createStock' },
  { name: 'Auditoría', href: '/admin/inventory/history', icon: History, color: 'text-purple-400', permission: 'viewAudit' },
];

interface NavbarProps {
  categories?: any[];
}

export const Navbar = ({ categories }: NavbarProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const cart = useCartStore((state) => state.cart);
  const { isLoggedIn, logout, user } = useAuthStore();

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

  // CORRECCIÓN ts(2339): Acceso seguro a propiedades de usuario
  const userName = (user as any)?.nombre || (user as any)?.name || "Usuario";
  
  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    document.documentElement.classList.toggle('dark', newTheme);
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
  };

  const itemCount = mounted ? cart.reduce((acc, item) => acc + item.quantity, 0) : 0;

  const hasPermission = (permissionName: string) => {
    if (!user) return false;
    const u = user as any;
    if (u.email === 'admin@engine.com') return true;
    if (u.role?.permisos) {
      return u.role.permisos[permissionName] === true;
    }
    return false;
  };

  const canAccessAdmin = ADMIN_ROUTES.some(route => hasPermission(route.permission));

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
      <AnimatePresence>{isLoggingOut && <TechLoader mode="logout" />}</AnimatePresence>

      <nav
        className="fixed top-0 left-0 w-full z-50 border-b h-16 flex items-center transition-all duration-300 shadow-sm backdrop-blur-md"
        style={{
          backgroundColor: isDarkMode ? 'rgba(15, 23, 42, 0.9)' : 'rgba(255, 255, 255, 0.9)',
          borderColor: isDarkMode ? '#1e293b' : '#f1f5f9'
        }}
      >
        <div className="max-w-[1400px] mx-auto px-4 w-full flex items-center justify-between">

          {/* 1. BOTÓN HAMBURGUESA (Móvil) */}
          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className="md:hidden p-2 rounded-xl hover:bg-slate-500/10 transition-colors"
            style={{ color: isDarkMode ? '#f8fafc' : '#0f172a' }}
          >
            <Menu size={24} />
          </button>

          {/* 2. LOGO */}
          <Link href="/" className="flex items-center gap-2 group shrink-0">
            <div className="bg-blue-600 text-white p-1.5 rounded-xl shadow-lg transition-transform group-hover:scale-105">
              <Laptop size={18} />
            </div>
            <span className="text-sm font-black tracking-tighter uppercase hidden sm:block" style={{ color: isDarkMode ? '#f8fafc' : '#0f172a' }}>
              TECH<span className="text-blue-600">STORE</span>
            </span>
          </Link>

          {/* 3. NAVEGACIÓN DESKTOP */}
          <div className="hidden md:flex items-center flex-1 justify-center gap-1">
            <ul className="flex items-center gap-1 text-[9px] font-black uppercase tracking-wider">
              {mounted && isLoggedIn && ADMIN_ROUTES.filter(r => hasPermission(r.permission)).map((route) => (
                <li key={route.href}>
                  <Link 
                    href={route.href} 
                    className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg hover:bg-slate-500/5 transition-all ${pathname === route.href ? 'bg-blue-600/10' : ''}`}
                    style={{ color: isDarkMode ? '#f8fafc' : '#0f172a' }}
                  >
                    <route.icon size={13} className={route.color} />
                    <span className="opacity-70 hover:opacity-100">{route.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 4. ACCIONES DERECHA */}
          <div className="flex items-center gap-1 sm:gap-2">
            
            {/* BOTÓN PANEL ADMIN (Corregido) */}
            {mounted && isLoggedIn && canAccessAdmin && (
              <Link 
                href="/admin"
                className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-600 text-white text-[9px] font-black uppercase hover:bg-blue-700 transition-all shadow-md shadow-blue-500/20 mr-2"
              >
                <ShieldCheck size={14} />
                <span>Panel Admin</span>
              </Link>
            )}

            {!isLoggedIn && (
              <Link href="/login" className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-blue-600/20 text-blue-600 text-[9px] font-black uppercase hover:bg-blue-600 hover:text-white transition-all">
                <LogIn size={14} />
                <span>Ingresar</span>
              </Link>
            )}

            <button onClick={toggleTheme} className="p-2 rounded-lg border hover:bg-slate-500/5 transition-all" style={{ borderColor: isDarkMode ? '#1e293b' : '#f1f5f9', color: isDarkMode ? '#94a3b8' : '#64748b' }}>
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <Link href="/cart" className="relative p-2 rounded-lg hover:bg-blue-600/5" style={{ color: isDarkMode ? '#f8fafc' : '#0f172a' }}>
              <ShoppingCart size={20} />
              {mounted && itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-[8px] font-black w-4 h-4 flex items-center justify-center rounded-full border-2 border-white dark:border-[#0f172a]">
                  {itemCount}
                </span>
              )}
            </Link>

            {mounted && isLoggedIn && (
              <button onClick={handleLogout} className="p-2 rounded-lg text-red-500 hover:bg-red-500/10 transition-colors">
                <LogOut size={20} />
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* --- SIDEBAR MÓVIL (CORREGIDO) --- */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsMobileMenuOpen(false)} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]" />
            <motion.div 
              initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 h-full w-[280px] z-[70] shadow-2xl p-6 flex flex-col"
              style={{ backgroundColor: isDarkMode ? '#0f172a' : '#ffffff' }}
            >
              <div className="flex items-center justify-between mb-8">
                <span className="text-xs font-black uppercase tracking-widest text-blue-600">Menú</span>
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 rounded-full hover:bg-slate-500/10">
                  <X size={20} />
                </button>
              </div>

              {isLoggedIn && (
                <div className="mb-8 p-4 rounded-2xl bg-blue-600/5 border border-blue-600/10">
                  <p className="text-[10px] font-bold text-blue-600 uppercase mb-1">Sesión activa</p>
                  <p className="font-black text-sm uppercase truncate" style={{ color: isDarkMode ? '#f8fafc' : '#0f172a' }}>{userName}</p>
                </div>
              )}

              <div className="flex-1 space-y-2">
                {isLoggedIn && canAccessAdmin && (
                   <p className="text-[10px] font-black opacity-30 uppercase tracking-widest mb-4">Administración</p>
                )}
                {isLoggedIn && ADMIN_ROUTES.filter(r => hasPermission(r.permission)).map((route) => (
                  <Link key={route.href} href={route.href} onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-between p-3 rounded-xl hover:bg-blue-600/5 group transition-all">
                    <div className="flex items-center gap-3">
                      <route.icon size={18} className={route.color} />
                      <span className="text-xs font-bold uppercase" style={{ color: isDarkMode ? '#cbd5e1' : '#1e293b' }}>{route.name}</span>
                    </div>
                    <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                ))}
              </div>

              {isLoggedIn && (
                <button onClick={handleLogout} className="mt-auto flex items-center gap-3 p-4 text-red-500 font-black text-xs uppercase hover:bg-red-500/5 rounded-2xl transition-all">
                  <LogOut size={18} />
                  Cerrar Sesión
                </button>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
      <div className="h-16 w-full"></div>
    </>
  );
};