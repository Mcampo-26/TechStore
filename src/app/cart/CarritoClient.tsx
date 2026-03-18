"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { AiOutlinePlus, AiOutlineMinus } from "react-icons/ai";
import { ShoppingBag, Trash2, AlertTriangle, ChevronLeft } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { useAuthStore } from "@/store/useAuthStore";
import { useProductStore } from "@/store/useProductStore";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Product } from "@/types";
import Swal from "sweetalert2";

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
        timerProgressBar: true
      });
    } else {
      updateQuantity(item.id, quantity + 1, userId);
    }
  };

  return (
    <div className="p-4 rounded-2xl shadow-sm flex flex-col sm:flex-row items-center gap-4 border transition-all duration-300"
         style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-theme)' }}>
      
      {/* Contenedor Imagen y Título en Móvil */}
      <div className="flex items-center w-full sm:w-auto gap-4">
        <div className="relative bg-white p-2 rounded-xl w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center shrink-0 overflow-hidden border border-gray-100">
          <Image src={item.image} alt={item.name} fill sizes="(max-width: 768px) 80px, 96px" className="object-contain p-2" />
        </div>
        <div className="sm:hidden flex-grow">
             <h3 className="font-bold text-md line-clamp-" style={{ color: 'var(--foreground)' }}>{item.name}</h3>
             <p className="text-blue-600 font-black mt-1">$ {price.toLocaleString('es-AR')}</p>
        </div>
      </div>

      <div className="flex-grow w-full">
        {/* Título en Desktop */}
        <h3 className="hidden sm:block font-bold text-base mb-2 line-clamp-1" style={{ color: 'var(--foreground)' }}>{item.name}</h3>
        
        <div className="flex items-center justify-between w-full mt-2 sm:mt-0">
          <div className="relative">
            {showError && (
              <div className="absolute -top-8 left-0 bg-red-600 text-white text-[10px] px-2 py-1 rounded shadow-lg animate-bounce flex items-center gap-1 z-10 font-bold whitespace-nowrap">
                <AlertTriangle size={14} /> Solo hay {stock}
              </div>
            )}
            <div className={`flex items-center border rounded-xl overflow-hidden transition-all ${showError ? 'border-red-500' : ''}`}
                 style={{ borderColor: 'var(--border-theme)' }}>
              <button onClick={() => updateQuantity(item.id, quantity - 1, userId)} 
                      className="p-2.5 opacity-60 hover:opacity-100 disabled:opacity-20" 
                      style={{ color: 'var(--foreground)' }}
                      disabled={quantity <= 1}><AiOutlineMinus /></button>
              <span className="px-4 font-black text-sm" style={{ color: 'var(--foreground)' }}>{quantity}</span>
              <button onClick={handleIncrease} 
                      className={`p-2.5 transition-colors ${quantity >= stock ? 'opacity-20' : 'text-blue-500 hover:bg-blue-500/10'}`}><AiOutlinePlus /></button>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Precio en Desktop */}
            <div className="hidden sm:block text-right">
                <p className="text-lg font-black" style={{ color: 'var(--foreground)' }}>$ {(price * quantity).toLocaleString('es-AR')}</p>
            </div>
            
            <button onClick={() => removeFromCart(item.id, userId)} 
                    className="bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all p-2.5 rounded-xl">
                <Trash2 size={20} />
            </button>
          </div>
        </div>

        {/* Subtotal en Móvil (solo visible abajo) */}
        <div className="sm:hidden flex justify-between items-center mt-4 pt-3 border-t border-dashed border-[var(--border-theme)]">
            <span className="text-[10px] uppercase font-black opacity-40" style={{ color: 'var(--foreground)' }}>Subtotal Producto</span>
            <p className="text-lg font-black" style={{ color: 'var(--foreground)' }}>$ {(price * quantity).toLocaleString('es-AR')}</p>
        </div>
      </div>
    </div>
  );
};

export default function CarritoClient({ initialProducts }: Props) {
  const { cart, removeFromCart, updateQuantity, revalidateCartStock } = useCartStore();
  const { user } = useAuthStore();
  const { setProducts } = useProductStore();
  const [isBuying, setIsBuying] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const router = useRouter();

  useEffect(() => {
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
      <div className="min-h-screen pt-32 flex flex-col items-center" style={{ backgroundColor: 'var(--background)' }}>
        <div className="p-12 rounded-[3rem] border text-center max-w-md w-full mx-4 shadow-xl" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-theme)' }}>
          <div className="bg-blue-500/5 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag size={40} className="opacity-20" style={{ color: 'var(--foreground)' }} />
          </div>
          <h2 className="text-2xl font-black mb-6 uppercase tracking-tight" style={{ color: 'var(--foreground)' }}>Tu carrito está vacío</h2>
          <Link href="/productos" className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-black uppercase text-xs tracking-widest block hover:bg-blue-500 transition-all shadow-lg active:scale-95">Explorar Productos</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-28 pb-20 px-4 transition-colors duration-300" style={{ backgroundColor: 'var(--background)' }}>
      <div className="max-w-6xl mx-auto">
        
        <Link 
          href="/productos" 
          className="flex items-center gap-2 mb-8 text-[10px] font-black uppercase tracking-[0.2em] opacity-40 hover:opacity-100 transition-all group w-fit"
          style={{ color: 'var(--foreground)' }}
        >
          <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Continuar Comprando
        </Link>

        <div className="flex items-baseline gap-3 mb-10">
          <h1 className="text-4xl sm:text-5xl font-black tracking-tighter" style={{ color: 'var(--foreground)' }}>MI CARRITO</h1>
          <span className="text-sm font-bold text-blue-600">[{cart.length} ITEMS]</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-8 space-y-4">
            {cart.map((item) => (
              <CartItemRow 
                key={item.id} 
                item={item} 
                updateQuantity={updateQuantity} 
                removeFromCart={removeFromCart} 
                userId={user?.id || (user as any)?._id} 
              />
            ))}
          </div>

          <div className="lg:col-span-4">
            <div className="p-8 rounded-[2.5rem] border sticky top-28 shadow-2xl" 
                 style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-theme)' }}>
              <h2 className="text-[10px] font-black uppercase tracking-[0.3em] mb-8 opacity-40 text-center" style={{ color: 'var(--foreground)' }}>Resumen de orden</h2>
              
              <div className="space-y-4 mb-8">
                <div className="flex justify-between" style={{ color: 'var(--foreground)' }}>
                  <span className="text-xs font-bold uppercase opacity-60">Subtotal</span>
                  <span className="font-black">$ {subtotal.toLocaleString('es-AR')}</span>
                </div>
                <div className="flex justify-between items-center bg-emerald-500/5 p-3 rounded-xl border border-emerald-500/10">
                  <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600">Envío a domicilio</span>
                  <span className="font-black text-emerald-600 text-sm">GRATIS</span>
                </div>
              </div>

              <div className="flex justify-between items-end pt-6 border-t mb-10" style={{ color: 'var(--foreground)', borderColor: 'var(--border-theme)' }}>
                <span className="text-xs font-black uppercase tracking-widest opacity-60">Total Final</span>
                <span className="text-4xl font-black tracking-tighter text-blue-600">$ {subtotal.toLocaleString('es-AR')}</span>
              </div>
              
              <div className="space-y-4">
                <button 
                  onClick={() => { setIsBuying(true); router.push("/checkout"); }} 
                  disabled={isBuying}
                  className="w-full bg-blue-600 text-white py-5 rounded-[1.5rem] font-black uppercase tracking-[0.2em] text-[11px] hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center transition-all shadow-xl shadow-blue-600/20 active:scale-95"
                >
                  {isBuying ? "Procesando..." : "Finalizar Compra"}
                </button>

                <p className="text-[9px] text-center opacity-40 font-bold uppercase tracking-tight" style={{ color: 'var(--foreground)' }}>
                  Garantía oficial y compra segura protegida
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}