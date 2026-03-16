"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingCart, Eye, Zap } from 'lucide-react';
import { Product } from '@/types';
import { useCartStore } from '@/store/useCartStore';
import { useAuthStore } from '@/store/useAuthStore';

interface ProductCardProps {
  product: Product;
  showAddButton?: boolean;
}

export const ProductCard = ({ product, showAddButton = false }: ProductCardProps) => {
  const addToCart = useCartStore((state) => state.addToCart);
  const [currentImg, setCurrentImg] = useState<string>(product.image || "");
  const [mounted, setMounted] = useState(false);

  // Sincronizamos el montaje para evitar discrepancias de imágenes o estados iniciales
  useEffect(() => {
    setMounted(true);
  }, []);

  const images = [product.image, product.image2, product.image3].filter(
    (img): img is string => typeof img === 'string' && img.trim() !== ""
  );

  const tieneDescuento = (product as any).isOferta && (product as any).descuento > 0;
  const precioOriginal = product.price;
  const precioFinal = tieneDescuento
    ? precioOriginal * (1 - (product as any).descuento / 100)
    : precioOriginal;

  const handleAddClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const authState = useAuthStore.getState();
    const currentUser = authState.user;
    const userId = currentUser?.id || (currentUser as any)?._id;

    if (!userId) return;
    addToCart(product, userId);
  };

  return (
    <div 
      className="group rounded-xl border p-4 hover:shadow-2xl transition-all h-full flex flex-col relative overflow-hidden"
      style={{ 
        backgroundColor: 'var(--card-bg)', 
        borderColor: 'var(--border-theme)' 
      }}
    >
      {/* BADGE DIAGONAL */}
      {(product as any).isOferta && (
        <div className="absolute top-0 right-0 z-20 pointer-events-none">
          <div className="absolute -top-3 -right-3 w-20 h-20 bg-blue-500/20 blur-2xl rounded-full" />
          <div className="relative">
            <div className="absolute top-5 -right-10 rotate-45 bg-gradient-to-r from-blue-600 to-blue-500 text-white text-[10px] font-extrabold tracking-widest uppercase px-10 py-1 shadow-xl flex items-center justify-center gap-1 border border-white/20 backdrop-blur-sm">
              <Zap size={11} className="fill-white" />
              Oferta
            </div>
          </div>
        </div>
      )}

      <Link href={`/productos/${product._id}`} className="flex-grow flex flex-col">
        <div className="relative w-full h-44 flex items-center justify-center mb-2 bg-white rounded-lg p-2">
          <img
            src={currentImg}
            className="max-h-full object-contain transition-all duration-300 group-hover:scale-105"
            alt={product.name}
          />
        </div>

        {/* Miniaturas */}
        <div className="flex gap-2 justify-center items-center h-16 mb-4">
          {images.length > 1 && images.map((img, i) => (
            <div
              key={i}
              onMouseEnter={() => setCurrentImg(img)}
              className={`w-12 h-12 border rounded-md overflow-hidden transition-all duration-200 cursor-pointer ${
                currentImg === img ? 'border-blue-500 ring-2 ring-blue-500/20' : 'border-transparent opacity-60 hover:opacity-100'
              }`}
              style={{ backgroundColor: 'var(--background)' }}
            >
              <img src={img} className="w-full h-full object-cover" alt="thumb" />
            </div>
          ))}
        </div>

        <div className="space-y-1 mt-auto">
          <h3 className="text-sm line-clamp-2 leading-tight min-h-[32px] font-medium" style={{ color: 'var(--foreground)' }}>
            {product.name}
          </h3>

          <div className="pt-2 flex flex-col">
            {tieneDescuento && (
              <span className="text-xs opacity-50 line-through" style={{ color: 'var(--foreground)' }}>
                $ {precioOriginal.toLocaleString('es-AR')}
              </span>
            )}
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>
                $ {precioFinal.toLocaleString('es-AR')}
              </span>
              {tieneDescuento && (
                <span className="text-green-500 text-xs font-bold bg-green-500/10 px-1.5 py-0.5 rounded">
                  {(product as any).descuento}% OFF
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>

      <div className="mt-4">
        {showAddButton ? (
          <button
            onClick={handleAddClick}
            className="w-full bg-[#3483fa] text-white py-2.5 rounded-lg font-bold hover:bg-[#2968c8] flex items-center justify-center gap-2 transition-all active:scale-95 shadow-md shadow-blue-500/10 cursor-pointer"
          >
            <ShoppingCart size={18} /> Agregar
          </button>
        ) : (
          <Link
            href={`/productos/${product._id}`}
            className="w-full py-2.5 rounded-lg font-bold flex items-center justify-center gap-2 transition-all text-center border-2 bg-white text-blue-600 border-blue-600 hover:bg-blue-600 hover:text-white dark:bg-transparent dark:text-white dark:border-white/20 dark:hover:bg-white dark:hover:text-black"
          >
            <Eye size={18} /> Ver detalles
          </Link>
        )}
      </div>
    </div>
  );
};