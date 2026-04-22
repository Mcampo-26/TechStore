"use client";

import React, { useEffect, useState } from 'react';
import {
  ShoppingCart, LogOut, Laptop, Menu, X,
  ShieldCheck, Sun, Database, Moon, User, ChevronRight, Flame,
  LayoutDashboard, PackagePlus, History, LogIn, Users, Settings2
} from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { useAuthStore } from '@/store/useAuthStore';
import Link from 'next/link';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { TechLoader } from '@/components/ui/TechLoader';
import { AnimatePresence } from 'framer-motion';

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
  categories: any[];
}

export const Navbar = ({ categories }: NavbarProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const cart = useCartStore((state) => state.cart);

  // Extraemos el estado global de autenticación
  const { isLoggedIn, logout, user } = useAuthStore();

  const [mounted, setMounted] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
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

  // LÓGICA DE NOMBRE: Prioridad al campo procesado en el Store
  const userName = user?.nombre || user?.name || "";
  const userEmail = user?.email || "";

  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    document.documentElement.classList.toggle('dark', newTheme);
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
  };

  const itemCount = mounted ? cart.reduce((acc, item) => acc + item.quantity, 0) : 0;

  // FUNCIÓN DE PERMISOS: Verifica el acceso a las rutas
  const hasPermission = (permissionName: string) => {
    if (!user) return false;
    
    // El admin principal por email tiene acceso total
    if (user.email === 'admin@engine.com') return true;

    // Type guard para verificar permisos en el objeto role
    if (user.role && typeof user.role === 'object' && 'permisos' in user.role) {
        return (user.role.permisos as Record<string, boolean>)?.[permissionName] === true;
    }

    return false;
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
      <AnimatePresence>{isLoggingOut && <TechLoader mode="logout" />}</AnimatePresence>

      <nav
        className="relative w-full z-40 border-b h-16 flex items-center transition-all duration-300 shadow-sm"
        style={{
          backgroundColor: isDarkMode ? '#0f172a' : '#ffffff',
          borderColor: isDarkMode ? '#1e293b' : '#f1f5f9'
        }}
      >
        <div className="max-w-[1400px] mx-auto px-4 w-full flex items-center justify-between">

          {/* 1. LOGO */}
          <Link href="/" className="flex items-center gap-2 group shrink-0 mr-4">
            <div className="bg-blue-600 text-white p-1.5 rounded-xl shadow-lg transition-transform group-hover:scale-105">
              <Laptop size={18} />
            </div>
            <span className="text-sm font-black tracking-tighter uppercase" style={{ color: isDarkMode ? '#f8fafc' : '#0f172a' }}>
              TECH<span className="text-blue-600">STORE</span>
            </span>
          </Link>

          {/* 2. NAVEGACIÓN PRINCIPAL */}
          <div className="hidden md:flex items-center flex-1 justify-center gap-1">
            <ul className="flex items-center gap-1 text-[9px] font-black uppercase tracking-wider">
              {mounted && isLoggedIn && ADMIN_ROUTES.filter(r => hasPermission(r.permission)).map((route) => (
                <li key={route.href}>
                  <Link 
                    href={route.href} 
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg hover:bg-slate-500/5 transition-all" 
                    style={{ color: isDarkMode ? '#f8fafc' : '#0f172a' }}
                  >
                    <route.icon size={13} className={route.color} />
                    <span className="opacity-70 hover:opacity-100">{route.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 3. ACCIONES DERECHA */}
          <div className="flex items-center gap-1 sm:gap-2">

            {/* PERFIL DE USUARIO */}
            {mounted && isLoggedIn && user && (
              <div className="hidden lg:flex items-center mr-4 pr-4 border-r border-slate-500/10">
                <div className="flex flex-col items-end">
                  <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 mb-0.5">
                    Bienvenido
                  </span>
                  <span 
                    className="text-[12px] font-black uppercase tracking-tighter" 
                    style={{ color: isDarkMode ? '#f8fafc' : '#0f172a' }}
                  >
                    {/* Se muestra el nombre real de la DB */}
                    {userName || "INVITADO"}
                  </span>
                </div>
              </div>
            )}
            
            {!isLoggedIn && (
              <Link 
                href="/login" 
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-blue-600/20 text-blue-600 text-[9px] font-black uppercase hover:bg-blue-600 hover:text-white transition-all"
              >
                <LogIn size={14} />
                <span>Ingresar</span>
              </Link>
            )}

            <button 
              onClick={toggleTheme} 
              className="p-2 rounded-lg border hover:bg-slate-500/5 transition-all"
              style={{ 
                borderColor: isDarkMode ? '#1e293b' : '#f1f5f9', 
                color: isDarkMode ? '#94a3b8' : '#64748b' 
              }}
            >
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <Link 
              href="/cart" 
              className="relative p-2 rounded-lg hover:bg-blue-600/5" 
              style={{ color: isDarkMode ? '#f8fafc' : '#0f172a' }}
            >
              <ShoppingCart size={20} />
              {mounted && itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-[8px] font-black w-4 h-4 flex items-center justify-center rounded-full border-2 border-white dark:border-[#0f172a]">
                  {itemCount}
                </span>
              )}
            </Link>

            {mounted && isLoggedIn && (
              <button 
                onClick={handleLogout} 
                className="p-2 rounded-lg text-red-500 hover:bg-red-500/10 transition-colors" 
                title="Cerrar Sesión"
              >
                <LogOut size={20} />
              </button>
            )}
          </div>
        </div>
      </nav>
    </>
  );
};