"use client";

import React, { useState, useEffect } from "react";
import { AiOutlinePlus, AiOutlineMinus } from "react-icons/ai";
import { ShoppingBag, Trash2, AlertTriangle } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { useAuthStore } from "@/store/useAuthStore";
import { useProductStore } from "@/store/useProductStore";
import { useRouter } from "next/navigation";
import Link from "next/link";

// --- SUB-COMPONENTE DE FILA ---
const CartItemRow = ({ item, updateQuantity, removeFromCart, userId }: any) => {
  const [showError, setShowError] = useState(false);
  const price = Number(item.price) || 0;
  const quantity = Number(item.quantity) || 0;
  const stock = Number(item.stock) || 0;

  const handleIncrease = () => {
    if (quantity >= stock) {
      setShowError(true);
      setTimeout(() => setShowError(false), 2000);
    } else {
      updateQuantity(item.id, quantity + 1, userId);
    }
  };

  return (
    <div className="p-4 rounded-xl shadow-sm flex items-center gap-4 border transition-all duration-300"
         style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-theme)' }}>
      <div className="bg-white p-2 rounded-lg w-24 h-24 flex items-center justify-center shrink-0">
        <img src={item.image} alt={item.name} className="max-h-full object-contain" />
      </div>
      <div className="flex-grow">
        <h3 className="font-medium text-sm md:text-base line-clamp-1" style={{ color: 'var(--foreground)' }}>{item.name}</h3>
        <div className="flex items-center justify-between mt-4">
          <div className="relative">
            {showError && (
              <div className="absolute -top-10 left-0 bg-red-600 text-white text-[10px] px-2 py-1 rounded shadow-lg animate-bounce flex items-center gap-1 z-10 font-bold whitespace-nowrap">
                <AlertTriangle size={10} /> Solo hay {stock} disponibles
              </div>
            )}
            <div className={`flex items-center border rounded-lg overflow-hidden transition-all ${showError ? 'animate-shake border-red-500' : ''}`}
                 style={{ borderColor: 'var(--border-theme)' }}>
              <button onClick={() => updateQuantity(item.id, quantity - 1, userId)} 
                      className="p-2 opacity-60 hover:opacity-100 disabled:opacity-20" 
                      style={{ color: 'var(--foreground)' }}
                      disabled={quantity <= 1}><AiOutlineMinus /></button>
              <span className="px-4 font-bold text-sm" style={{ color: 'var(--foreground)' }}>{quantity}</span>
              <button onClick={handleIncrease} 
                      className={`p-2 transition-colors ${quantity >= stock ? 'opacity-20' : 'text-blue-500 hover:bg-blue-500/10'}`}><AiOutlinePlus /></button>
            </div>
          </div>
          <button onClick={() => removeFromCart(item.id, userId)} 
                  className="opacity-40 hover:opacity-100 hover:text-red-500 transition-all p-2"><Trash2 size={20} /></button>
        </div>
      </div>
      <div className="text-right min-w-[100px]">
        <p className="text-xl font-light" style={{ color: 'var(--foreground)' }}>$ {(price * quantity).toLocaleString('es-AR')}</p>
      </div>
    </div>
  );
};

// --- COMPONENTE PRINCIPAL ---
export default function CarritoPage() {
  const { cart, removeFromCart, updateQuantity, revalidateCartStock } = useCartStore();
  const { user } = useAuthStore();
  const { products, fetchProducts } = useProductStore();
  
  const [isBuying, setIsBuying] = useState(false);
  const [hydrated, setHydrated] = useState(false); // Reemplaza isMounted para mayor claridad
  const router = useRouter();

  // 1. Manejo de hidratación de Zustand
  useEffect(() => {
    setHydrated(true);
    if (products.length === 0) fetchProducts();
  }, [fetchProducts, products.length]);

  // 2. Revalidar stock cuando los productos cargan
  useEffect(() => {
    if (hydrated && products.length > 0) {
      revalidateCartStock(products);
    }
  }, [products, hydrated, revalidateCartStock]);

  const subtotal = cart.reduce((acc, item) => acc + (Number(item.price) * Number(item.quantity)), 0);

  if (!hydrated) return null; // Evita el parpadeo de contenido mal renderizado

  if (cart.length === 0) {
    return (
      <div className="min-h-screen pt-32 flex flex-col items-center" style={{ backgroundColor: 'var(--background)' }}>
        <div className="p-12 rounded-[3rem] border text-center max-w-md w-full mx-4 shadow-xl" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-theme)' }}>
          <div className="bg-blue-500/5 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag size={40} className="opacity-20" style={{ color: 'var(--foreground)' }} />
          </div>
          <h2 className="text-2xl font-black mb-2 uppercase tracking-tight" style={{ color: 'var(--foreground)' }}>Tu carrito está vacío</h2>
          <p className="text-sm opacity-50 mb-8" style={{ color: 'var(--foreground)' }}>Parece que aún no has agregado nada.</p>
          <Link href="/productos" className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold block hover:bg-blue-500 transition-all shadow-lg shadow-blue-500/20 active:scale-95">Explorar productos</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-28 pb-12 px-4 transition-colors duration-300" style={{ backgroundColor: 'var(--background)' }}>
      <div className="max-w-6xl mx-auto">
        <div className="flex items-end gap-3 mb-10">
          <h1 className="text-4xl font-black tracking-tighter" style={{ color: 'var(--foreground)' }}>CARRITO</h1>
          <span className="text-sm font-bold text-blue-600 mb-1">({cart.length} items)</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* LISTA DE ITEMS */}
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

          {/* RESUMEN */}
          <div className="lg:col-span-4">
            <div className="p-8 rounded-[2.5rem] border sticky top-28 shadow-xl" 
                 style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-theme)' }}>
              <h2 className="text-xs font-black uppercase tracking-[0.2em] mb-8 opacity-40" style={{ color: 'var(--foreground)' }}>Resumen de compra</h2>
              
              <div className="space-y-4 mb-8">
                <div className="flex justify-between" style={{ color: 'var(--foreground)' }}>
                  <span className="text-sm opacity-60">Subtotal</span>
                  <span className="font-medium">$ {subtotal.toLocaleString('es-AR')}</span>
                </div>
                <div className="flex justify-between text-emerald-500">
                  <span className="text-sm font-bold uppercase tracking-widest text-[10px]">Envío</span>
                  <span className="font-bold">Gratis</span>
                </div>
              </div>

              <div className="flex justify-between items-end pt-6 border-t mb-8" style={{ color: 'var(--foreground)', borderColor: 'var(--border-theme)' }}>
                <span className="text-sm font-bold opacity-60 uppercase tracking-widest">Total</span>
                <span className="text-3xl font-black tracking-tighter">$ {subtotal.toLocaleString('es-AR')}</span>
              </div>

              <button 
                onClick={() => { setIsBuying(true); router.push("/checkout"); }} 
                disabled={isBuying}
                className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-blue-500 disabled:opacity-50 flex items-center justify-center transition-all shadow-lg shadow-blue-500/20 active:scale-95"
              >
                {isBuying ? "Cargando..." : "Finalizar Pedido"}
              </button>
              
              <p className="text-[10px] text-center mt-6 opacity-40 uppercase font-bold tracking-tighter" style={{ color: 'var(--foreground)' }}>
                Pagos seguros procesados por Stripe & PayPal
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}