"use client";

import React, { useEffect, useState } from "react";
import { AiOutlinePlus, AiOutlineMinus } from "react-icons/ai";
import { ShoppingBag, Trash2, AlertTriangle } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { useAuthStore } from "@/store/useAuthStore";
import Link from "next/link";

// Componente para cada fila del carrito para manejar su propia animación
const CartItemRow = ({ item, updateQuantity, removeFromCart, userId }: any) => {
  const [showError, setShowError] = useState(false);

  const handleIncrease = () => {
    if (item.quantity >= item.stock) {
      // Activa la animación
      setShowError(true);
      // La quitamos después de 2 segundos
      setTimeout(() => setShowError(false), 2000);
    } else {
      updateQuantity(item.id, item.quantity + 1, userId);
    }
  };

  return (
    <div key={item.id} className="bg-white p-4 rounded-xl shadow-sm flex items-center gap-4 border border-transparent">
      <img src={item.image} alt={item.name} className="w-24 h-24 object-contain" />
      
      <div className="flex-grow">
        <h3 className="text-gray-800 font-medium">{item.name}</h3>
        
        <div className="flex items-center justify-between mt-4">
          <div className="relative"> {/* Contenedor relativo para el aviso flotante */}
            
            {/* AVISO ANIMADO */}
            {showError && (
              <div className="absolute -top-10 left-0 bg-black text-white text-[10px] px-2 py-1 rounded shadow-lg animate-bounce flex items-center gap-1 z-10">
                <AlertTriangle size={10} className="text-yellow-400" />
                Solo hay {item.stock} disponibles
              </div>
            )}

            <div className={`flex items-center border border-gray-300 rounded-lg overflow-hidden transition-transform ${showError ? 'animate-shake border-red-500' : ''}`}>
              <button 
                onClick={() => updateQuantity(item.id, item.quantity - 1, userId)} 
                className="p-2 hover:bg-gray-50 disabled:opacity-20" 
                disabled={item.quantity <= 1}
              >
                <AiOutlineMinus />
              </button>

              <span className="px-4 font-bold text-gray-700">{item.quantity}</span>

              <button 
                onClick={handleIncrease} 
                className={`p-2 transition-colors ${item.quantity >= item.stock ? 'text-gray-300' : 'text-blue-600 hover:bg-gray-50'}`}
              >
                <AiOutlinePlus />
              </button>
            </div>
          </div>
          
          <button onClick={() => removeFromCart(item.id, userId)} className="text-gray-400 hover:text-red-500 transition-colors">
            <Trash2 size={20} />
          </button>
        </div>
      </div>

      <div className="text-right min-w-[100px]">
        <p className="text-xl font-light">$ {(item.price * item.quantity).toLocaleString('es-AR')}</p>
      </div>
    </div>
  );
};

export default function CarritoPage() {
  const { cart, removeFromCart, updateQuantity } = useCartStore();
  const { user } = useAuthStore();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => { setIsMounted(true); }, []);

  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  if (!isMounted) return null;

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-[#f5f5f5] pt-32 flex flex-col items-center">
        <div className="bg-white p-10 rounded-xl shadow-sm text-center max-w-md w-full mx-4">
          <ShoppingBag size={80} className="mx-auto text-gray-200 mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Tu carrito está vacío</h2>
          <Link href="/" className="bg-[#3483fa] text-white px-8 py-3 rounded-lg font-bold block mt-6">
            Ir a la tienda
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f5f5] pt-28 pb-12 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-8">Carrito de compras</h1>
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
             <div className="bg-white p-6 rounded-xl shadow-sm sticky top-28">
               <h2 className="text-lg font-bold mb-6 border-b pb-4 text-gray-800">Resumen de compra</h2>
               <div className="flex justify-between text-xl font-bold pt-4">
                 <span>Total</span>
                 <span>$ {subtotal.toLocaleString('es-AR')}</span>
               </div>
               <button className="w-full bg-[#3483fa] text-white py-4 rounded-xl font-bold mt-6 hover:bg-blue-600 transition-colors">
                 Continuar compra
               </button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}