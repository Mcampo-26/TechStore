"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingCart, Zap, ChevronRight } from 'lucide-react';
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

  if (!mounted) return null;

  return (
    <div 
      className="group flex flex-col h-full rounded-3xl border transition-all duration-300 hover:shadow-xl overflow-hidden"
      style={{ 
        backgroundColor: 'var(--card-bg)', 
        borderColor: 'var(--border-theme)' 
      }}
    >
      {/* SECCIÓN DE IMAGEN */}
      <div className="relative p-3">
        {tieneDescuento && (
          <div className="absolute top-5 left-5 z-10 bg-blue-600 text-white text-[10px] font-black px-2.5 py-1 rounded-lg uppercase tracking-wider shadow-lg shadow-blue-500/30">
            { (product as any).descuento }% OFF
          </div>
        )}

        <Link href={`/productos/${product._id}`} className="block aspect-[4/3] rounded-2xl overflow-hidden bg-white p-4">
          <img
            src={currentImg}
            className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
            alt={product.name}
          />
        </Link>
      </div>

      {/* CUERPO DE LA TARJETA */}
      <div className="px-5 pb-5 flex flex-col flex-grow">
        
        {/* MINIATURAS (usando variables de fondo) */}
        <div className="flex gap-1.5 mb-4 justify-start">
          {images.length > 1 && images.map((img, i) => (
            <button
              key={i}
              onMouseEnter={() => setCurrentImg(img)}
              className={`w-9 h-9 rounded-lg border transition-all p-1 bg-white ${
                currentImg === img ? 'border-blue-500 ring-2 ring-blue-500/10' : 'border-transparent opacity-40'
              }`}
            >
              <img src={img} className="w-full h-full object-contain" alt="thumb" />
            </button>
          ))}
        </div>

        <Link href={`/productos/${product._id}`} className="flex-grow">
          <h3 
            className="text-[14px] font-bold line-clamp-2 leading-snug mb-2 transition-colors group-hover:text-blue-600"
            style={{ color: 'var(--foreground)' }}
          >
            {product.name}
          </h3>

          <div className="mb-3">
            {tieneDescuento && (
              <p className="text-[12px] opacity-40 line-through font-medium" style={{ color: 'var(--foreground)' }}>
                $ {precioOriginal.toLocaleString('es-AR')}
              </p>
            )}
            <div className="flex items-center gap-2">
              <span className="text-2xl font-black tracking-tight" style={{ color: 'var(--foreground)' }}>
                $ {precioFinal.toLocaleString('es-AR')}
              </span>
            </div>
            <p className="text-green-500 text-[11px] font-black uppercase mt-1 flex items-center gap-1">
              <Zap size={12} fill="currentColor" /> Envío gratis
            </p>
          </div>
        </Link>

        {/* BOTONES (respetando estilos de sistema) */}
        <div className="mt-2">
          {showAddButton ? (
            <button
              onClick={handleAddClick}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white h-11 rounded-xl font-black text-[11px] uppercase tracking-widest transition-all active:scale-95 flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 cursor-pointer"
            >
              <ShoppingCart size={16} />
              Agregar
            </button>
          ) : (
            <Link
              href={`/productos/${product._id}`}
              className="w-full h-11 rounded-xl font-black text-[11px] uppercase tracking-widest border-2 transition-all flex items-center justify-center gap-2 group/btn"
              style={{ 
                borderColor: 'var(--border-theme)',
                color: 'var(--foreground)' 
              }}
            >
              Detalles
              <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};