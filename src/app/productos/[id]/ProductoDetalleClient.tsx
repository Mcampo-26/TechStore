"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/store/useCartStore';
import { useAuthStore } from '@/store/useAuthStore';
import { useProductStore } from '@/store/useProductStore';
import { 
  ArrowLeft, ShoppingCart, ShieldCheck, Truck, Star, 
  CheckCircle2, Zap, RotateCcw, Info 
} from 'lucide-react';
import Link from 'next/link';
import { Product } from '@/types';

interface ProductoDetalleClientProps {
  product: Product;
}

export default function ProductoDetalleClient({ product }: ProductoDetalleClientProps) {
  const router = useRouter();
  const { setCurrentProduct } = useProductStore();
  const addToCart = useCartStore((state) => state.addToCart);
  const { user, isLoggedIn } = useAuthStore();

  // Local UI State
  const [isBuyingNow, setIsBuyingNow] = useState(false);
  const [mainImage, setMainImage] = useState<string>(product?.image || '');

  // 1. GUARDA DE SEGURIDAD (Evita el error de 'image' is undefined)
  if (!product) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // 2. Sincronizar el store al montar
  useEffect(() => {
    setCurrentProduct(product);
    if (product.image) setMainImage(product.image);
  }, [product, setCurrentProduct]);

  // --- LÓGICA DE PRECIOS ---
  const esOferta = String(product.isOferta) === "true";
  const descuentoNum = Number(product.descuento || 0);
  const precioOriginal = Number(product.price) || 0;
  const precioFinal = (esOferta && descuentoNum > 0) 
    ? precioOriginal * (1 - (descuentoNum / 100)) 
    : precioOriginal;
  const hasStock = product.stock > 0;

  const handleBuyNow = () => {
    if (!hasStock) return;
    setIsBuyingNow(true);
    const userId = user?.id || (user as any)?._id;
    
    setTimeout(() => router.push("/checkout"), 800);
  };

  const handleAddToCart = () => {
    const userId = user?.id || (user as any)?._id;
    addToCart({ ...product, price: precioFinal }, userId);
  };

  const allImages = [product.image, product.image2, product.image3].filter(Boolean) as string[];

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 transition-colors duration-300" 
         style={{ backgroundColor: 'var(--background)' }}>
      <div className="max-w-6xl mx-auto">
        
        <button onClick={() => router.back()} className="group flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] transition-all mb-8" style={{ color: 'var(--foreground)' }}>
          <div className="p-2 rounded-full border shadow-sm" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-theme)' }}>
            <ArrowLeft size={14} />
          </div>
          <span className="opacity-60 group-hover:opacity-100 group-hover:text-blue-600">Volver al listado</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* GALERÍA */}
          <div className="lg:col-span-7 rounded-[2.5rem] p-8 border shadow-sm flex flex-col items-center" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-theme)' }}>
            <div className="w-full aspect-square flex items-center justify-center bg-white rounded-[2rem] mb-6 overflow-hidden p-8 shadow-inner">
              <img src={mainImage} alt={product.name} className="max-h-full max-w-full object-contain hover:scale-105 transition-transform duration-500" />
            </div>
            <div className="flex gap-4">
              {allImages.map((img, i) => (
                <button key={i} onClick={() => setMainImage(img)} className={`w-20 h-20 rounded-2xl p-2 transition-all border-2 bg-white ${mainImage === img ? 'border-blue-500 shadow-md scale-105' : 'border-transparent opacity-40 hover:opacity-100'}`}>
                  <img src={img} className="w-full h-full object-contain" alt="thumb" />
                </button>
              ))}
            </div>
          </div>

          {/* COMPRA */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="rounded-[2.5rem] p-10 border shadow-sm" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-theme)' }}>
              <div className="flex items-center gap-2 mb-4">
                <span className="bg-blue-600/10 text-blue-600 text-[10px] font-black px-2 py-1 rounded-lg uppercase tracking-widest">Premium</span>
                <Star size={12} className="text-yellow-400" fill="currentColor" />
                <span className="text-xs opacity-50 font-bold" style={{ color: 'var(--foreground)' }}>4.9 Garantizado</span>
              </div>

              <h1 className="text-3xl font-bold mb-4 tracking-tight" style={{ color: 'var(--foreground)' }}>{product.name}</h1>

              <div className="mb-8">
                {esOferta && <span className="text-lg opacity-40 line-through font-medium" style={{ color: 'var(--foreground)' }}>$ {precioOriginal.toLocaleString('es-AR')}</span>}
                <div className="flex items-center gap-3">
                  <span className="text-5xl font-black tracking-tighter" style={{ color: 'var(--foreground)' }}>$ {precioFinal.toLocaleString('es-AR')}</span>
                  {esOferta && <span className="bg-emerald-500 text-white text-xs font-black px-2 py-1 rounded-md">{descuentoNum}% OFF</span>}
                </div>
              </div>

              <div className="space-y-4 mb-8">
                {isLoggedIn ? (
                  <>
                    <button 
      onClick={handleBuyNow} 
      disabled={isBuyingNow || !hasStock} 
      aria-label="Comprar este producto ahora" // Mejora tu accesibilidad (SEO)
      className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-500 transition-all flex items-center justify-center disabled:opacity-50 shadow-lg active:scale-95"
    >
      {isBuyingNow ? (
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          <span>Procesando...</span>
        </div>
      ) : (
        "Comprar ahora"
      )}
    </button>
                    <button onClick={handleAddToCart} disabled={!hasStock} className="w-full py-5 rounded-2xl font-bold text-sm tracking-widest uppercase flex items-center justify-center gap-3 border-2 border-[var(--border-theme)] text-[var(--foreground)] hover:bg-blue-600 hover:text-white transition-all">
                      <ShoppingCart size={18} /> {!hasStock ? 'Sin Stock' : 'Agregar al carrito'}
                    </button>
                  </>
                ) : (
                  <Link href="/login" className="block text-center w-full py-5 rounded-2xl font-bold text-sm tracking-widest uppercase border-2 border-[var(--border-theme)] text-[var(--foreground)] hover:bg-blue-600 hover:text-white transition-all">
                    Ingresar para comprar
                  </Link>
                )}
              </div>

              <div className="flex items-center gap-4 border-t pt-8" style={{ borderColor: 'var(--border-theme)' }}>
                <Truck size={20} className="text-blue-500" />
                <div>
                  <p className="text-sm font-bold" style={{ color: 'var(--foreground)' }}>Envío Prioritario</p>
                  <p className="text-xs opacity-50" style={{ color: 'var(--foreground)' }}>Disponible para tu ubicación</p>
                </div>
              </div>
            </div>

            <div className="rounded-[2rem] p-6 border flex justify-between bg-[var(--nav-bg)] border-[var(--border-theme)]">
                {[{icon: ShieldCheck, text: "Seguro"}, {icon: RotateCcw, text: "Garantía"}, {icon: CheckCircle2, text: "Oficial"}].map((item, i) => (
                  <div key={i} className="flex flex-col items-center text-center gap-2">
                      <item.icon size={20} className="text-blue-500" />
                      <span className="text-[9px] font-black uppercase opacity-60 leading-none" style={{ color: 'var(--foreground)' }}>{item.text}</span>
                  </div>
                ))}
            </div>
          </div>

          <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
            <div className="rounded-[2.5rem] p-10 border" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-theme)' }}>
                <h3 className="text-lg font-black uppercase tracking-widest mb-6 flex items-center gap-2" style={{ color: 'var(--foreground)' }}><Info size={18} className="text-blue-600" /> Detalles</h3>
                <p className="opacity-70 leading-relaxed text-sm whitespace-pre-line" style={{ color: 'var(--foreground)' }}>{product.description}</p>
            </div>
            <div className="rounded-[2.5rem] p-10 border" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-theme)' }}>
                <h3 className="text-lg font-black uppercase tracking-widest mb-6 flex items-center gap-2" style={{ color: 'var(--foreground)' }}><Zap size={18} className="text-blue-600" /> Especificaciones</h3>
                <div className="flex justify-between py-3 border-b border-[var(--border-theme)]">
                    <span className="text-xs font-bold opacity-40 uppercase">Categoría</span>
                    <span className="text-xs font-bold" style={{ color: 'var(--foreground)' }}>{product.category}</span>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}