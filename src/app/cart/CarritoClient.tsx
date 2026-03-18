"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { AiOutlinePlus, AiOutlineMinus } from "react-icons/ai";
import { ShoppingBag, Trash2, AlertTriangle, ChevronLeft, Truck, ShieldCheck, ArrowRight } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { useAuthStore } from "@/store/useAuthStore";
import { useProductStore } from "@/store/useProductStore";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Product } from "@/types";
import Swal from "sweetalert2";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  initialProducts: Product[];
}

const CartItemRow = ({ item, updateQuantity, removeFromCart, userId }: any) => {
  const [showError, setShowError] = useState(false);
  const price = Number(item.price) || 0;
  const quantity = Number(item.quantity) || 0;
  const stock = Number(item.stock) || 0;

  const handleIncrease = () => {
    if (quantity >= stock) {
      setShowError(true);
      setTimeout(() => setShowError(false), 2000);
      
      Swal.fire({
        title: '¡Límite alcanzado!',
        text: `Solo tenemos ${stock} unidades disponibles.`,
        icon: 'warning',
        toast: true,
        position: 'top-end',
        timer: 3000,
        showConfirmButton: false,
        timerProgressBar: true,
        background: 'var(--card-bg)',
        color: 'var(--foreground)'
      });
    } else {
      updateQuantity(item.id, quantity + 1, userId);
    }
  };

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="group p-6 rounded-[2.5rem] flex flex-col sm:flex-row items-center gap-8 border border-[var(--border-theme)] bg-[var(--card-bg)] transition-all duration-500 hover:shadow-2xl hover:shadow-black/5 dark:hover:shadow-none hover:border-blue-500/30"
    >
      
      <div className="relative bg-neutral-500/5 dark:bg-white/5 rounded-[2rem] w-full sm:w-44 h-44 flex items-center justify-center shrink-0 overflow-hidden transition-transform duration-500 group-hover:scale-105">
        <Image 
          src={item.image} 
          alt={item.name} 
          fill 
          sizes="(max-width: 768px) 100vw, 176px" 
          className="object-contain p-4 drop-shadow-lg" 
        />
      </div>

      <div className="flex-grow w-full flex flex-col justify-between py-2">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
          <div className="max-w-md">
            <h3 className="font-bold text-xl sm:text-2xl tracking-tighter text-[var(--foreground)] leading-tight">
              {item.name}
            </h3>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-30 text-[var(--foreground)] mt-2">
              REF: {item.id.slice(-6)}
            </p>
          </div>
          <p className="hidden sm:block text-3xl font-black text-[var(--foreground)] tracking-tighter">
            ${(price * quantity).toLocaleString('es-AR')}
          </p>
        </div>
        
        <div className="flex items-center justify-between w-full">
          <div className="relative">
            <AnimatePresence>
              {showError && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="absolute -top-10 left-0 bg-red-600 text-white text-[9px] px-3 py-1.5 rounded-full shadow-xl flex items-center gap-1.5 z-10 font-black uppercase tracking-widest whitespace-nowrap"
                >
                  <AlertTriangle size={12} /> Stock: {stock} unidades
                </motion.div>
              )}
            </AnimatePresence>
            
            <div className={`flex items-center bg-neutral-500/5 dark:bg-white/5 rounded-2xl overflow-hidden border transition-all duration-300 ${showError ? 'border-red-500 shadow-lg shadow-red-500/20' : 'border-[var(--border-theme)]'}`}>
              <button 
                onClick={() => updateQuantity(item.id, quantity - 1, userId)} 
                className="p-4 opacity-40 hover:opacity-100 hover:bg-white dark:hover:bg-neutral-800 transition-all disabled:opacity-10" 
                disabled={quantity <= 1}
              >
                <AiOutlineMinus size={16} />
              </button>
              <span className="px-6 font-black text-base text-[var(--foreground)] min-w-[3.5rem] text-center">{quantity}</span>
              <button 
                onClick={handleIncrease} 
                className={`p-4 transition-all ${quantity >= stock ? 'opacity-10' : 'text-blue-600 hover:bg-blue-600 hover:text-white'}`}
              >
                <AiOutlinePlus size={16} />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="sm:hidden text-right mr-2">
                <p className="text-2xl font-black text-[var(--foreground)] tracking-tighter">${(price * quantity).toLocaleString('es-AR')}</p>
            </div>
            
            <button 
              onClick={() => removeFromCart(item.id, userId)} 
              className="group/trash bg-red-500/5 text-red-500 hover:bg-red-500 hover:text-white transition-all duration-500 p-4 rounded-2xl border border-red-500/10 shadow-lg shadow-red-500/5"
            >
                <Trash2 size={20} className="group-hover/trash:scale-110 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default function CarritoClient({ initialProducts }: Props) {
  const { cart, removeFromCart, updateQuantity, revalidateCartStock } = useCartStore();
  const { user } = useAuthStore();
  const { setProducts } = useProductStore();
  const [isBuying, setIsBuying] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const router = useRouter();

  // EFECTO PARA IR ARRIBA AL CARGAR
  useEffect(() => {
    window.scrollTo(0, 0);
    setHydrated(true);
    if (initialProducts) {
      setProducts(initialProducts);
      revalidateCartStock(initialProducts);
    }
  }, [initialProducts, setProducts, revalidateCartStock]);

  const subtotal = cart.reduce((acc, item) => acc + (Number(item.price) * Number(item.quantity)), 0);

  if (!hydrated) return null;

  if (cart.length === 0) {
    return (
      <div className="min-h-screen pt-40 pb-20 flex flex-col items-center bg-[var(--background)] px-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-16 rounded-[4rem] border border-[var(--border-theme)] text-center max-w-lg w-full bg-[var(--card-bg)] shadow-2xl shadow-black/5"
        >
          <div className="bg-blue-600/10 w-28 h-28 rounded-full flex items-center justify-center mx-auto mb-8 ring-1 ring-blue-600/20">
            <ShoppingBag size={48} className="text-blue-600 opacity-40" />
          </div>
          <h2 className="text-3xl font-black mb-4 uppercase tracking-tighter text-[var(--foreground)]">Espacio Vacío</h2>
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] opacity-30 mb-10 text-[var(--foreground)]">Tu carrito está esperando ser llenado</p>
          <Link 
            href="/productos" 
            className="bg-blue-600 text-white px-10 py-5 rounded-full font-black uppercase text-[10px] tracking-[0.3em] block hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20 active:scale-95"
          >
            Explorar Catálogo
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-24 px-6 bg-[var(--background)] transition-colors duration-500">
      <div className="max-w-7xl mx-auto">
        
        <Link 
          href="/productos" 
          className="flex items-center gap-4 mb-12 text-[10px] font-black uppercase tracking-[0.4em] opacity-30 hover:opacity-100 hover:text-blue-600 transition-all group w-fit text-[var(--foreground)]"
        >
          <div className="p-2 rounded-full border border-[var(--border-theme)] group-hover:border-blue-600 transition-colors">
            <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
          </div>
          Seguir Comprando
        </Link>

        <div className="flex flex-col md:flex-row md:items-end gap-4 mb-16">
          <h1 className="text-6xl sm:text-8xl font-black tracking-[-0.06em] text-[var(--foreground)] uppercase leading-none">
            Carrito
          </h1>
          <div className="flex items-center gap-3 pb-2">
            <span className="h-[2px] w-12 bg-blue-600"></span>
            <span className="text-[11px] font-black uppercase tracking-[0.3em] text-blue-600">
              {cart.length} Selección{cart.length !== 1 ? 'es' : ''}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          <div className="lg:col-span-8 space-y-6">
            <AnimatePresence mode="popLayout">
              {cart.map((item) => (
                <CartItemRow 
                  key={item.id} 
                  item={item} 
                  updateQuantity={updateQuantity} 
                  removeFromCart={removeFromCart} 
                  userId={user?.id || (user as any)?._id} 
                />
              ))}
            </AnimatePresence>
          </div>

          <div className="lg:col-span-4">
            <div className="p-10 rounded-[3rem] border border-[var(--border-theme)] sticky top-32 bg-[var(--card-bg)] shadow-2xl shadow-black/5 dark:shadow-none">
              <h2 className="text-[10px] font-black uppercase tracking-[0.4em] mb-10 opacity-30 text-center text-[var(--foreground)]">
                Resumen de Compra
              </h2>
              
              <div className="space-y-6 mb-10">
                <div className="flex justify-between text-[var(--foreground)] items-center">
                  <span className="text-[10px] font-black uppercase opacity-40 tracking-widest">Subtotal</span>
                  <span className="text-xl font-bold tracking-tighter">$ {subtotal.toLocaleString('es-AR')}</span>
                </div>
                
                <div className="flex justify-between items-center p-5 rounded-[1.5rem] bg-emerald-500/5 border border-emerald-500/10">
                  <div className="flex items-center gap-3 text-emerald-600">
                    <Truck size={18} />
                    <span className="text-[9px] font-black uppercase tracking-widest leading-none">Envío Estándar</span>
                  </div>
                  <span className="font-black text-emerald-600 text-xs">GRATIS</span>
                </div>
              </div>

              <div className="flex flex-col gap-2 pt-8 border-t border-[var(--border-theme)] mb-10 text-[var(--foreground)]">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-30">Valor Total</span>
                <span className="text-5xl font-black tracking-tighter text-blue-600">
                   $ {subtotal.toLocaleString('es-AR')}
                </span>
              </div>
              
              <div className="space-y-4">
                <button 
                  onClick={() => { setIsBuying(true); router.push("/checkout"); }} 
                  disabled={isBuying}
                  className="group relative w-full bg-blue-600 text-white py-6 rounded-full font-black uppercase tracking-[0.3em] text-[10px] hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center transition-all shadow-2xl shadow-blue-600/20 active:scale-95 overflow-hidden"
                >
                  <span className="relative z-10 flex items-center gap-3">
                    {isBuying ? "Procesando Pedido..." : "Finalizar Compra"}
                    <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
                  </span>
                  <div className="absolute inset-0 bg-white/10 -translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
                </button>

                <div className="flex items-center justify-center gap-4 pt-4 opacity-20">
                    <ShieldCheck size={16} className="text-[var(--foreground)]" />
                    <p className="text-[8px] font-black uppercase tracking-widest text-[var(--foreground)]">
                      Transacción Segura Nivel 4
                    </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}