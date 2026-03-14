"use client";

import React, { useEffect, useState } from "react";
import { 
  X, ShoppingBag, Trash2, Truck, CreditCard, 
  ChevronLeft 
} from "lucide-react";
import { useCartStore } from "@/store/useCartStore"; 
import { useRouter } from "next/navigation";

export const CartDrawer = () => {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const cart = useCartStore((state) => state.cart);
  const isDrawerOpen = useCartStore((state) => state.isDrawerOpen);
  const closeDrawer = useCartStore((state) => state.closeDrawer);
  const removeFromCart = useCartStore((state) => state.removeFromCart);

  useEffect(() => { 
    setMounted(true); 
  }, []);

  // --- SOLUCIÓN AL CONFLICTO ---
  // Si el drawer está abierto pero el último producto agregado disparó un error 
  // o si detectamos que se abrió por error durante una validación de stock, lo cerramos.
  useEffect(() => {
    if (isDrawerOpen && cart.length > 0) {
      // Verificamos el stock de los items en el carrito
      const lastItem = cart[cart.length - 1];
      if (lastItem && lastItem.stock < 1) {
        closeDrawer();
      }
    }
  }, [isDrawerOpen, cart, closeDrawer]);

  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handleCheckout = () => {
    if (cart.length === 0) return;
    setIsLoading(true);
    
    setTimeout(() => {
      closeDrawer(); 
      router.push("/checkout");
      setIsLoading(false);
    }, 1500);
  };

  if (!mounted) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className={`fixed inset-0 z-[9998] bg-black/70 backdrop-blur-sm transition-opacity duration-300 ${
          isDrawerOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={closeDrawer}
      />

      {/* Drawer Panel */}
      <div className={`fixed right-0 top-0 h-full w-full max-w-md z-[9999] shadow-2xl flex flex-col transition-transform duration-500 ease-in-out ${
        isDrawerOpen ? "translate-x-0" : "translate-x-full"
      }`} style={{ backgroundColor: 'var(--card-bg)' }}>
        
        {/* Header */}
        <div className="p-6 border-b flex justify-between items-center" style={{ borderColor: 'var(--border-theme)' }}>
          <div className="flex items-center gap-3">
            <ShoppingBag className="text-blue-600" size={24} />
            <h2 className="font-black text-xl uppercase italic tracking-tighter" style={{ color: 'var(--foreground)' }}>
                Tu Carrito <span className="text-blue-600">({cart.length})</span>
            </h2>
          </div>
          <button onClick={closeDrawer} className="p-2 hover:bg-black/10 rounded-full transition-colors">
            <X size={28} style={{ color: 'var(--foreground)' }} />
          </button>
        </div>

        {/* Contenido */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center opacity-20">
              <ShoppingBag size={100} style={{ color: 'var(--foreground)' }} />
              <p className="font-black uppercase text-xs mt-4 tracking-[0.3em]" style={{ color: 'var(--foreground)' }}>Carrito Vacío</p>
            </div>
          ) : (
            <>
              <div className="space-y-4">
                {cart.map((item) => (
                  <div key={item.id} className="flex gap-4 p-5 rounded-[2rem] border transition-all shadow-sm min-h-[150px]"
                       style={{ backgroundColor: 'var(--nav-bg)', borderColor: 'var(--border-theme)' }}>
                    
                    <div className="w-24 h-24 flex-shrink-0 bg-white rounded-2xl p-2 shadow-inner flex items-center justify-center border" 
                         style={{ borderColor: 'var(--border-theme)' }}>
                      <img src={item.image} alt={item.name} className="max-w-full max-h-full object-contain" />
                    </div>

                    <div className="flex-1 min-w-0 flex flex-col">
                      <h3 className="font-black text-[14px] uppercase truncate mb-1" style={{ color: 'var(--foreground)' }}>
                          {item.name}
                      </h3>
                      <p className="text-[12px] leading-relaxed font-medium mb-4" 
                         style={{ color: 'var(--foreground)', opacity: 0.7 }}>
                        {item.description}
                      </p>

                      <div className="flex justify-between items-center mt-auto">
                        <p className="text-blue-600 font-black text-xl">$ {item.price.toLocaleString('es-AR')}</p>
                        <div className="px-3 py-1 rounded-full border font-black text-[10px] uppercase bg-black/5" 
                             style={{ borderColor: 'var(--border-theme)', color: 'var(--foreground)' }}>
                          Cant: {item.quantity}
                        </div>
                      </div>
                    </div>

                    <button onClick={() => removeFromCart(item.id)} className="text-red-500 hover:scale-110 transition-transform self-start p-1">
                      <Trash2 size={20} />
                    </button>
                  </div>
                ))}
              </div>

              <div className="space-y-3 px-2 text-[10px] font-black uppercase tracking-wider">
                <div className="flex items-center gap-4 p-4 rounded-3xl border" style={{ backgroundColor: 'var(--nav-bg)', borderColor: 'var(--border-theme)', color: 'var(--foreground)' }}>
                  <Truck size={20} className="text-blue-600" />
                  <span>Envío Gratis Incluido</span>
                </div>
                <div className="flex items-center gap-4 p-4 rounded-3xl border" style={{ backgroundColor: 'var(--nav-bg)', borderColor: 'var(--border-theme)', color: 'var(--foreground)' }}>
                  <CreditCard size={20} className="text-purple-600" />
                  <span>Hasta 6 Cuotas sin interés</span>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-8 border-t space-y-4" style={{ borderColor: 'var(--border-theme)', backgroundColor: 'var(--card-bg)' }}>
          <div className="flex justify-between items-end mb-4">
             <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-1 opacity-40" style={{ color: 'var(--foreground)' }}>Total a pagar</p>
                <p className="text-3xl font-black tracking-tighter text-blue-600">$ {total.toLocaleString('es-AR')}</p>
             </div>
          </div>
          
          <div className="flex flex-col gap-3">
            <button 
              onClick={handleCheckout}
              disabled={isLoading || cart.length === 0}
              className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold transition-all flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/20 active:scale-95"
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

            <button 
              onClick={closeDrawer}
              className="w-full py-4 border-2 font-black text-[10px] uppercase tracking-[0.2em] rounded-[1.5rem] flex items-center justify-center gap-2 transition-all hover:bg-black/5 active:scale-95"
              style={{ borderColor: 'var(--border-theme)', color: 'var(--foreground)' }}
            >
              <ChevronLeft size={16} /> Seguir Navegando
            </button>
          </div>
        </div>
      </div>
    </>
  );
};