"use client";

import React, { useEffect, useState } from "react";
import { 
  X, ShoppingBag, Trash2, Truck, CreditCard, 
  ArrowRight, ShieldCheck, RotateCcw, CheckCircle2, ChevronLeft 
} from "lucide-react";
import { useCartStore } from "@/store/useCartStore"; 

export const CartDrawer = () => {
  const [mounted, setMounted] = useState(false);
  const cart = useCartStore((state) => state.cart);
  const isDrawerOpen = useCartStore((state) => state.isDrawerOpen);
  const closeDrawer = useCartStore((state) => state.closeDrawer);
  const removeFromCart = useCartStore((state) => state.removeFromCart);

  useEffect(() => { setMounted(true); }, []);

  if (!mounted) return null;

  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <>
      {/* Overlay - Se oculta si el drawer está cerrado */}
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

        {/* Contenido Scrolleable */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center opacity-20">
              <ShoppingBag size={100} style={{ color: 'var(--foreground)' }} />
              <p className="font-black uppercase text-xs mt-4 tracking-[0.3em]" style={{ color: 'var(--foreground)' }}>Carrito Vacío</p>
            </div>
          ) : (
            <>
              {/* Cards de Productos */}
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
                         style={{ color: 'var(--foreground)', opacity: 1 }}>
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

              {/* Información de Envío y Pago Sólida */}
              <div className="space-y-3 px-2">
                <div className="flex items-center gap-4 p-4 rounded-3xl border" style={{ backgroundColor: 'var(--nav-bg)', borderColor: 'var(--border-theme)' }}>
                  <Truck size={20} className="text-blue-600" />
                  <p className="text-[10px] font-black uppercase tracking-wider" style={{ color: 'var(--foreground)' }}>Envío Gratis Incluido</p>
                </div>
                <div className="flex items-center gap-4 p-4 rounded-3xl border" style={{ backgroundColor: 'var(--nav-bg)', borderColor: 'var(--border-theme)' }}>
                  <CreditCard size={20} className="text-purple-600" />
                  <p className="text-[10px] font-black uppercase tracking-wider" style={{ color: 'var(--foreground)' }}>Hasta 6 Cuotas sin interés</p>
                </div>
              </div>

              {/* Bloques de Garantía */}
              <div className="rounded-[2.5rem] p-6 border flex justify-between gap-2 shadow-sm"
                   style={{ backgroundColor: 'var(--nav-bg)', borderColor: 'var(--border-theme)' }}>
                <div className="flex flex-col items-center text-center gap-2 flex-1">
                    <ShieldCheck size={22} className="text-blue-500" />
                    <span className="text-[9px] font-black uppercase leading-none" style={{ color: 'var(--foreground)' }}>Compra<br/>Protegida</span>
                </div>
                <div className="flex flex-col items-center text-center gap-2 flex-1 border-x" style={{ borderColor: 'var(--border-theme)' }}>
                    <RotateCcw size={22} className="text-blue-500" />
                    <span className="text-[9px] font-black uppercase leading-none" style={{ color: 'var(--foreground)' }}>30 días de<br/>devolución</span>
                </div>
                <div className="flex flex-col items-center text-center gap-2 flex-1">
                    <CheckCircle2 size={22} className="text-blue-500" />
                    <span className="text-[9px] font-black uppercase leading-none" style={{ color: 'var(--foreground)' }}>Garantía de<br/>fábrica</span>
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
             <ShoppingBag size={30} className="opacity-10" style={{ color: 'var(--foreground)' }} />
          </div>
          
          <div className="flex flex-col gap-3">
            <button className="w-full py-5 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs uppercase tracking-[0.25em] rounded-[1.5rem] shadow-2xl shadow-blue-600/30 flex items-center justify-center gap-3 transition-all active:scale-95 group">
              Iniciar Compra Segura 
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
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