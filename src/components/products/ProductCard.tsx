"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart, Zap, ChevronRight } from 'lucide-react';
import { Product } from '@/types';
import { useCartStore } from '@/store/useCartStore';
import { useAuthStore } from '@/store/useAuthStore';

// Imagen de respaldo para evitar el error de src=""
const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1560393464-5c69a73c5770?q=80&w=500&auto=format&fit=crop";

interface ProductCardProps {
  product: Product;
  showAddButton?: boolean;
}

export const ProductCard = ({ product, showAddButton = false }: ProductCardProps) => {
  const addToCart = useCartStore((state) => state.addToCart);
  
  // Determinamos la imagen inicial validando que no sea un string vacío
  const initialImage = product.image && product.image.trim() !== "" 
    ? product.image 
    : FALLBACK_IMAGE;

  const [currentImg, setCurrentImg] = useState<string>(initialImage);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Filtramos las imágenes para las miniaturas asegurando que sean strings válidos
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

  // Evita errores de hidratación
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
          <div className="absolute top-5 left-5 z-20 bg-blue-600 text-white text-[10px] font-black px-2.5 py-1 rounded-lg uppercase tracking-wider shadow-lg shadow-blue-500/30">
            { (product as any).descuento }% OFF
          </div>
        )}

        <Link href={`/productos/${product._id}`} className="relative block aspect-[4/3] rounded-2xl overflow-hidden bg-white p-4">
          <Image
            src={currentImg || FALLBACK_IMAGE}
            alt={product.name}
            fill 
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority={true} 
            className="object-contain p-4 transition-transform duration-500 group-hover:scale-105"
            onError={() => setCurrentImg(FALLBACK_IMAGE)}
          />
        </Link>
      </div>

      {/* CUERPO DE LA TARJETA */}
      <div className="px-5 pb-5 flex flex-col flex-grow">
        
        {/* MINIATURAS OPTIMIZADAS */}
        <div className="flex gap-1.5 mb-4 justify-start">
          {images.length > 1 && images.map((img, i) => (
            <button
              key={i}
              onMouseEnter={() => setCurrentImg(img)}
              className={`relative w-9 h-9 rounded-lg border transition-all p-1 bg-white overflow-hidden ${
                currentImg === img ? 'border-blue-500 ring-2 ring-blue-500/10' : 'border-transparent opacity-40'
              }`}
            >
              <Image 
                src={img || FALLBACK_IMAGE} 
                alt={`thumb-${i}`} 
                fill
                sizes="40px"
                className="object-contain p-0.5"
                onError={(e) => {
                   // Si la miniatura falla, podrías ocultarla o poner fallback
                   (e.target as any).src = FALLBACK_IMAGE;
                }}
              />
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
    <p className="text-[12px] opacity-40 line-through font-medium mb-0.5" style={{ color: 'var(--foreground)' }}>
      $ {precioOriginal.toLocaleString('es-AR')}
    </p>
  )}

  <div className="flex items-center justify-between gap-2 py-1">
    <div className="flex flex-col">
      <span className="text-[10px] font-black uppercase opacity-40 tracking-widest">Precio</span>
      <span 
        className="text-3xl font-black italic tracking-tighter leading-none" 
        style={{ color: 'var(--foreground)' }}
      >
        ${precioFinal.toLocaleString('es-AR')}
      </span>
    </div>

    {/* El botón circular con la flecha de tu imagen */}
    {!showAddButton && (
      <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-white group-hover:bg-blue-600 transition-colors shadow-lg">
        <ChevronRight size={20} className="-rotate-45" />
      </div>
    )}
  </div>

  <p className="text-green-500 text-[11px] font-black uppercase mt-1 flex items-center gap-1">
    <Zap size={12} fill="currentColor" /> Envío gratis
  </p>
</div>
        </Link>

        {/* BOTONES */}
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