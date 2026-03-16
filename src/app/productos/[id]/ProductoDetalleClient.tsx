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

  const [isBuyingNow, setIsBuyingNow] = useState(false);
  const [mainImage, setMainImage] = useState<string>(product?.image || '');

  if (!product) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  useEffect(() => {
    setCurrentProduct(product);
    if (product.image) setMainImage(product.image);
  }, [product, setCurrentProduct]);

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
    setTimeout(() => router.push("/checkout"), 800);
  };

  const handleAddToCart = () => {
    const userId = user?.id || (user as any)?._id;
    addToCart({ ...product, price: precioFinal }, userId);
  };

  const allImages = [product.image, product.image2, product.image3].filter(Boolean) as string[];

  // LÓGICA PARA RENDERIZAR ESPECIFICACIONES DINÁMICAS
  const renderSpecs = () => {
    const specs = (product as any).specifications;
    
    // Si no hay especificaciones, solo mostramos la categoría
    if (!specs || (typeof specs === 'object' && Object.keys(specs).length === 0)) {
      return (
        <div className="flex justify-between py-4 border-b border-[var(--border-theme)]">
          <span className="text-[10px] font-black uppercase tracking-widest opacity-40">Categoría</span>
          <span className="text-xs font-bold" style={{ color: 'var(--foreground)' }}>{product.category}</span>
        </div>
      );
    }

    // Si es un objeto, lo mapeamos
    return Object.entries(specs).map(([key, value], index) => (
      <div key={index} className="flex justify-between py-4 border-b border-[var(--border-theme)] last:border-0">
        <span className="text-[10px] font-black uppercase tracking-widest opacity-40">{key}</span>
        <span className="text-xs font-bold" style={{ color: 'var(--foreground)' }}>{String(value)}</span>
      </div>
    ));
  };

  // ... (mantenemos toda la lógica anterior de hooks y funciones)

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 transition-colors duration-300" 
         style={{ backgroundColor: 'var(--background)' }}>
      <div className="max-w-6xl mx-auto">
        
        {/* BOTÓN VOLVER */}
        <button onClick={() => router.back()} className="group flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] transition-all mb-8" style={{ color: 'var(--foreground)' }}>
          <div className="p-2 rounded-full border shadow-sm" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-theme)' }}>
            <ArrowLeft size={14} />
          </div>
          <span className="opacity-60 group-hover:opacity-100 group-hover:text-blue-600">Volver al listado</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* COLUMNA IZQUIERDA: GALERÍA */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <div className="rounded-[3rem] p-4 border shadow-sm overflow-hidden" 
                 style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-theme)' }}>
              <div className="w-full aspect-square flex items-center justify-center bg-white rounded-[2.5rem] overflow-hidden p-12">
                <img 
                  src={mainImage} 
                  alt={product.name} 
                  className="max-h-full max-w-full object-contain transition-transform duration-700 hover:scale-110" 
                />
              </div>
            </div>
            
            {/* MINIATURAS HORIZONTALES */}
            <div className="flex gap-4 justify-center">
              {allImages.map((img, i) => (
                <button 
                  key={i} 
                  onClick={() => setMainImage(img)} 
                  className={`w-24 h-24 rounded-3xl p-3 transition-all border-2 bg-white ${mainImage === img ? 'border-blue-500 shadow-xl scale-110' : 'border-transparent opacity-50 hover:opacity-100'}`}
                >
                  <img src={img} className="w-full h-full object-contain" alt="thumbnail" />
                </button>
              ))}
            </div>
          </div>

          {/* COLUMNA DERECHA: INFO DE COMPRA */}
          <div className="lg:col-span-5 space-y-6">
            <div className="rounded-[2.5rem] p-10 border shadow-sm" 
                 style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-theme)' }}>
              
              <div className="flex items-center justify-between mb-6">
                <span className="bg-blue-600 text-white text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest shadow-lg shadow-blue-500/20">
                  {product.category}
                </span>
                <div className="flex items-center gap-1">
                  <Star size={14} className="text-amber-400" fill="currentColor" />
                  <span className="text-xs font-black" style={{ color: 'var(--foreground)' }}>4.9</span>
                </div>
              </div>

              <h1 className="text-4xl font-black mb-6 leading-tight tracking-tighter" style={{ color: 'var(--foreground)' }}>
                {product.name}
              </h1>

              <div className="mb-10">
                {esOferta && (
                  <span className="text-xl opacity-30 line-through font-bold block mb-1" style={{ color: 'var(--foreground)' }}>
                    $ {precioOriginal.toLocaleString('es-AR')}
                  </span>
                )}
                <div className="flex items-center gap-4">
                  <span className="text-6xl font-black tracking-tighter" style={{ color: 'var(--foreground)' }}>
                    $ {precioFinal.toLocaleString('es-AR')}
                  </span>
                  {esOferta && (
                    <div className="bg-emerald-500/10 text-emerald-500 text-xs font-black px-3 py-1.5 rounded-xl border border-emerald-500/20">
                      {descuentoNum}% OFF
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                {isLoggedIn ? (
                  <>
                    <button 
                      onClick={handleBuyNow} 
                      disabled={isBuyingNow || !hasStock} 
                      className="w-full bg-blue-600 text-white py-5 rounded-[1.5rem] font-black text-sm uppercase tracking-widest hover:bg-blue-500 transition-all shadow-xl shadow-blue-600/20 active:scale-95 disabled:opacity-50"
                    >
                      {isBuyingNow ? "Iniciando compra..." : "Comprar Ahora"}
                    </button>
                    <button 
                      onClick={handleAddToCart} 
                      disabled={!hasStock} 
                      className="w-full py-5 rounded-[1.5rem] font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 border-2 transition-all hover:bg-blue-600 hover:text-white"
                      style={{ borderColor: 'var(--border-theme)', color: 'var(--foreground)' }}
                    >
                      <ShoppingCart size={20} /> {!hasStock ? 'Sin Stock' : 'Al Carrito'}
                    </button>
                  </>
                ) : (
                  <Link href="/login" className="block text-center w-full py-5 rounded-[1.5rem] font-black text-sm uppercase tracking-widest border-2 hover:bg-blue-600 hover:text-white transition-all"
                        style={{ borderColor: 'var(--border-theme)', color: 'var(--foreground)' }}>
                    Iniciar sesión para comprar
                  </Link>
                )}
              </div>
            </div>

            {/* BOTONES DE CONFIANZA */}
            <div className="grid grid-cols-3 gap-4">
               {[
                 {icon: ShieldCheck, text: "Pago Seguro"},
                 {icon: RotateCcw, text: "Devolución"},
                 {icon: CheckCircle2, text: "Garantía"}
               ].map((item, i) => (
                 <div key={i} className="rounded-3xl p-4 border flex flex-col items-center gap-2 text-center"
                      style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-theme)' }}>
                   <item.icon size={22} className="text-blue-600" />
                   <span className="text-[9px] font-black uppercase opacity-60" style={{ color: 'var(--foreground)' }}>{item.text}</span>
                 </div>
               ))}
            </div>
          </div>

          {/* SECCIÓN DETALLES: OCUPANDO TODO EL ANCHO ABAJO */}
          <div className="lg:col-span-12">
            <div className="rounded-[3rem] p-12 border shadow-sm relative overflow-hidden" 
                 style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-theme)' }}>
              
              {/* Decoración de fondo */}
              <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none">
                <Info size={200} />
              </div>

              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-10">
                  <div className="w-12 h-12 bg-blue-600/10 rounded-2xl flex items-center justify-center">
                    <Info size={24} className="text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black uppercase tracking-tighter" style={{ color: 'var(--foreground)' }}>
                      Descripción del Producto
                    </h2>
                    <p className="text-xs font-bold text-blue-600 uppercase tracking-widest">Conoce cada detalle</p>
                  </div>
                </div>

                <div className="max-w-4xl">
                  <p className="text-lg leading-relaxed opacity-80 whitespace-pre-line font-medium" 
                     style={{ color: 'var(--foreground)' }}>
                    {product.description}
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );}