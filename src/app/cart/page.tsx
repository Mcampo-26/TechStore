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
    <div className="bg-white p-4 rounded-xl shadow-sm flex items-center gap-4 border border-transparent">
      <img src={item.image} alt={item.name} className="w-24 h-24 object-contain" />
      
      <div className="flex-grow">
        <h3 className="text-gray-800 font-medium">{item.name}</h3>
        
        <div className="flex items-center justify-between mt-4">
          <div className="relative">
            {showError && (
              <div className="absolute -top-10 left-0 bg-black text-white text-[10px] px-2 py-1 rounded shadow-lg animate-bounce flex items-center gap-1 z-10">
                <AlertTriangle size={10} className="text-yellow-400" />
                Solo hay {stock} disponibles
              </div>
            )}

            <div className={`flex items-center border border-gray-300 rounded-lg overflow-hidden transition-transform ${showError ? 'animate-shake border-red-500' : ''}`}>
              <button 
                onClick={() => updateQuantity(item.id, quantity - 1, userId)} 
                className="p-2 hover:bg-gray-50 disabled:opacity-20" 
                disabled={quantity <= 1}
              >
                <AiOutlineMinus />
              </button>

              <span className="px-4 font-bold text-gray-700">{quantity}</span>

              <button 
                onClick={handleIncrease} 
                className={`p-2 transition-colors ${quantity >= stock ? 'text-gray-300' : 'text-blue-600 hover:bg-gray-50'}`}
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
        <p className="text-xl font-light">$ {(price * quantity).toLocaleString('es-AR')}</p>
      </div>
    </div>
  );
};

export default function CarritoPage() {
  const { cart, removeFromCart, updateQuantity, revalidateCartStock } = useCartStore();
  const { user } = useAuthStore();
  const { products } = useProductStore();
  const [isMounted, setIsMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Estado para el loader
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

  // Función para manejar el clic en continuar
  const handleCheckout = () => {
    setIsLoading(true);
    // Simulamos una carga de red de 1.5 segundos
    setTimeout(() => {
      router.push("/checkout");
    }, 1500);
  };

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
             <div className="bg-white p-6 rounded-xl shadow-sm sticky top-28 border border-gray-100">
               <h2 className="text-lg font-bold mb-6 border-b pb-4 text-gray-800">Resumen de compra</h2>
               
               <div className="space-y-3 mb-6">
                 <div className="flex justify-between text-gray-600 text-sm">
                   <span>Productos ({cart.length})</span>
                   <span>$ {subtotal.toLocaleString('es-AR')}</span>
                 </div>
                 <div className="flex justify-between text-green-600 text-sm font-medium">
                   <span>Envío</span>
                   <span>Gratis</span>
                 </div>
               </div>

               <div className="flex justify-between text-xl font-bold pt-4 border-t border-gray-100">
                 <span>Total</span>
                 <span>$ {subtotal.toLocaleString('es-AR')}</span>
               </div>

               <button 
                 onClick={handleCheckout}
                 disabled={isLoading}
                 className="w-full bg-[#3483fa] text-white py-4 rounded-xl font-bold mt-6 hover:bg-blue-600 transition-all flex items-center justify-center disabled:bg-blue-300 disabled:cursor-not-allowed"
               >
                 {isLoading ? (
                   <div className="flex items-center gap-3">
                     {/* Spinner animado */}
                     <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                     <span>Procesando...</span>
                   </div>
                 ) : (
                   "Continuar compra"
                 )}
               </button>
               
               <p className="text-[11px] text-gray-400 text-center mt-4 uppercase tracking-tighter">
                 Compra segura con tecnología de encriptación
               </p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}