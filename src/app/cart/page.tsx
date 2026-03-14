"use client";

import React, { useEffect, useState } from "react";
import { AiOutlinePlus, AiOutlineMinus } from "react-icons/ai";
import { ShoppingBag, Trash2, AlertTriangle } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { useAuthStore } from "@/store/useAuthStore";
import { useProductStore } from "@/store/useProductStore";
import { useRouter } from "next/navigation";
import Link from "next/link";

// Componente para cada fila del carrito
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
      
      {/* Contenedor de imagen con fondo blanco siempre para que el producto luzca bien */}
      <div className="bg-white p-2 rounded-lg w-24 h-24 flex items-center justify-center">
        <img src={item.image} alt={item.name} className="max-h-full object-contain" />
      </div>
      
      <div className="flex-grow">
        <h3 className="font-medium text-sm md:text-base" style={{ color: 'var(--foreground)' }}>
          {item.name}
        </h3>
        
        <div className="flex items-center justify-between mt-4">
          <div className="relative">
            {showError && (
              <div className="absolute -top-10 left-0 bg-red-600 text-white text-[10px] px-2 py-1 rounded shadow-lg animate-bounce flex items-center gap-1 z-10 font-bold">
                <AlertTriangle size={10} className="text-white" />
                Solo hay {stock} disponibles
              </div>
            )}

            <div className={`flex items-center border rounded-lg overflow-hidden transition-all ${showError ? 'animate-shake border-red-500' : ''}`}
                 style={{ borderColor: 'var(--border-theme)' }}>
              <button 
                onClick={() => updateQuantity(item.id, quantity - 1, userId)} 
                className="p-2 opacity-60 hover:opacity-100 disabled:opacity-20" 
                style={{ color: 'var(--foreground)' }}
                disabled={quantity <= 1}
              >
                <AiOutlineMinus />
              </button>

              <span className="px-4 font-bold" style={{ color: 'var(--foreground)' }}>{quantity}</span>

              <button 
                onClick={handleIncrease} 
                className={`p-2 transition-colors ${quantity >= stock ? 'opacity-20' : 'text-blue-500 hover:bg-blue-500/10'}`}
              >
                <AiOutlinePlus />
              </button>
            </div>
          </div>
          
          <button onClick={() => removeFromCart(item.id, userId)} 
                  className="opacity-40 hover:opacity-100 hover:text-red-500 transition-all">
            <Trash2 size={20} />
          </button>
        </div>
      </div>

      <div className="text-right min-w-[100px]">
        <p className="text-xl font-light" style={{ color: 'var(--foreground)' }}>
          $ {(price * quantity).toLocaleString('es-AR')}
        </p>
      </div>
    </div>
  );
};

export default function CarritoPage() {
  const { cart, removeFromCart, updateQuantity, revalidateCartStock } = useCartStore();
  const { user } = useAuthStore();
  const { products } = useProductStore();
  const [isMounted, setIsMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => { 
    setIsMounted(true); 
  }, []);

  useEffect(() => {
    if (isMounted && products.length > 0) {
      revalidateCartStock();
    }
  }, [isMounted, user, products, revalidateCartStock]);

  const subtotal = cart.reduce((acc, item) => {
    const p = Number(item.price) || 0;
    const q = Number(item.quantity) || 0;
    return acc + (p * q);
  }, 0);

  const handleCheckout = () => {
    setIsLoading(true);
    setTimeout(() => {
      router.push("/checkout");
    }, 1500);
  };

  if (!isMounted) return null;

  if (cart.length === 0) {
    return (
      <div className="min-h-screen pt-32 flex flex-col items-center transition-colors duration-300"
           style={{ backgroundColor: 'var(--background)' }}>
        <div className="p-10 rounded-3xl border text-center max-w-md w-full mx-4 shadow-xl"
             style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-theme)' }}>
          <ShoppingBag size={80} className="mx-auto opacity-10 mb-4" style={{ color: 'var(--foreground)' }} />
          <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--foreground)' }}>Tu carrito está vacío</h2>
          <Link href="/" className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold block mt-6 hover:bg-blue-500 transition-all shadow-lg shadow-blue-500/20">
            Ir a la tienda
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-28 pb-12 px-4 transition-colors duration-300"
         style={{ backgroundColor: 'var(--background)' }}>
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-8" style={{ color: 'var(--foreground)' }}>Carrito de compras</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => (
              <CartItemRow 
                key={item.id} 
                item={item} 
                updateQuantity={updateQuantity} 
                removeFromCart={removeFromCart} 
                userId={user?.id} 
              />
            ))}
          </div>
          
          <div className="lg:col-span-1">
             <div className="p-6 rounded-2xl border sticky top-28 shadow-xl transition-all"
                  style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-theme)' }}>
               <h2 className="text-lg font-bold mb-6 border-b pb-4" style={{ color: 'var(--foreground)', borderColor: 'var(--border-theme)' }}>Resumen de compra</h2>
               
               <div className="space-y-3 mb-6">
                 <div className="flex justify-between text-sm opacity-60" style={{ color: 'var(--foreground)' }}>
                   <span>Productos ({cart.length})</span>
                   <span>$ {subtotal.toLocaleString('es-AR')}</span>
                 </div>
                 <div className="flex justify-between text-emerald-500 text-sm font-bold uppercase tracking-tighter">
                   <span>Envío</span>
                   <span>Gratis</span>
                 </div>
               </div>

               <div className="flex justify-between text-xl font-black pt-4 border-t" style={{ color: 'var(--foreground)', borderColor: 'var(--border-theme)' }}>
                 <span>Total</span>
                 <span>$ {subtotal.toLocaleString('es-AR')}</span>
               </div>

               <button 
                 onClick={handleCheckout}
                 disabled={isLoading}
                 className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold mt-6 hover:bg-blue-500 transition-all flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/20"
               >
                 {isLoading ? (
                   <div className="flex items-center gap-3">
                     <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                     <span>Procesando...</span>
                   </div>
                 ) : (
                   "Continuar compra"
                 )}
               </button>
               
               <p className="text-[11px] opacity-40 text-center mt-4 uppercase tracking-tighter font-bold" style={{ color: 'var(--foreground)' }}>
                 Compra segura con tecnología de encriptación
               </p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}