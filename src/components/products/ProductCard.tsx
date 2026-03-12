"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { ShoppingCart, Eye } from 'lucide-react';
import { Product } from '@/types';
import { useCartStore } from '@/store/useCartStore';
import { useAuthStore } from '@/store/useAuthStore'; 

interface ProductCardProps {
  product: Product;
  showAddButton?: boolean;
}

export const ProductCard = ({ product, showAddButton = false }: ProductCardProps) => {
  // ✅ Corregimos el error ts(7006) definiendo el tipo de 'state'
  const addToCart = useCartStore((state) => state.addToCart);
  const user = useAuthStore((state) => state.user); 
  
  const [currentImg, setCurrentImg] = useState<string>(product.image || "");

  const images = [product.image, product.image2, product.image3].filter(
    (img): img is string => typeof img === 'string' && img.trim() !== ""
  );

  const handleAddClick = (e: React.MouseEvent) => {
    e.preventDefault();
   e.stopPropagation();
    
    // 1. OBTENEMOS EL ESTADO ACTUAL DIRECTAMENTE DEL STORE (SIN ESPERAR A REACT)
    const authState = useAuthStore.getState();
    const currentUser = authState.user;

    // 2. BUSCAMOS EL ID EN TODAS SUS FORMAS
    const userId = currentUser?.id || (currentUser as any)?._id;

    console.log("-----------------------------------------");
    console.log("🔍 INTENTO DE AGREGADO CRÍTICO");
    console.log("Estado logueado:", authState.isLoggedIn);
    console.log("Contenido del User:", currentUser);
    console.log("ID Final capturado:", userId);
    console.log("-----------------------------------------");

    if (!userId) {
      console.error("❌ ERROR: userId sigue siendo undefined al momento del click.");
      return;
    }
    
    addToCart(product, userId); 
  };

  return (
    <div className="group bg-white rounded-lg border border-gray-200 p-4 hover:shadow-xl transition-all h-full flex flex-col relative overflow-hidden">
      <Link href={`/productos/${product._id}`} className="flex-grow flex flex-col">
        <div className="relative w-full h-44 flex items-center justify-center mb-2">
          <img 
            src={currentImg} 
            className="max-h-full object-contain mix-blend-multiply transition-all duration-300 group-hover:scale-105" 
            alt={product.name} 
          />
        </div>

        <div className="flex gap-2 justify-center items-center h-16 mb-4">
          {images.length > 1 && images.map((img, i) => (
            <div 
              key={i} 
              onMouseEnter={() => setCurrentImg(img)}
              className={`w-14 h-14 border rounded-md overflow-hidden transition-all duration-200 cursor-pointer ${
                currentImg === img ? 'border-[#7d00f8] ring-2 ring-[#7d00f8]/20' : 'border-gray-200'
              }`}
            >
              <img src={img} className="w-full h-full object-cover" alt="thumb" />
            </div>
          ))}
        </div>

        <div className="space-y-1 mt-auto">
          <h3 className="text-gray-600 text-sm line-clamp-2 leading-tight min-h-[32px]">{product.name}</h3>
          <div className="pt-2">
            <span className="text-2xl font-normal text-gray-900">$ {product.price?.toLocaleString('es-AR')}</span>
          </div>
        </div>
      </Link>

      <div className="mt-4">
        {showAddButton ? (
          <button 
            onClick={handleAddClick} 
            className="w-full bg-[#3483fa] text-white py-2.5 rounded-md font-semibold hover:bg-[#2968c8] flex items-center justify-center gap-2 transition-colors active:scale-95"
          >
            <ShoppingCart size={18} /> Agregar
          </button>
        ) : (
          <Link
            href={`/productos/${product._id}`}
            className="w-full bg-[#7d00f8] text-white py-2.5 rounded-md font-semibold hover:bg-[#6a00d4] flex items-center justify-center gap-2 transition-colors text-center"
          >
            <Eye size={18} /> Ver producto
          </Link>
        )}
      </div>
    </div>
  );
};