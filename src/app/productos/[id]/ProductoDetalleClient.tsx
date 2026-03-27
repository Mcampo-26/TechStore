"use client";

import React, { useEffect, useState, useRef, useMemo } from "react";
import { useProductStore } from "@/store/useProductStore";
import { Product } from "@/types";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { 
  ChevronLeft, 
  Zap, 
  Star, 
  ShoppingCart, 
  Truck, 
  ShieldCheck, 
  ZoomIn
} from "lucide-react"; 
import Image from 'next/image';
import { useCartStore } from '@/store/useCartStore';
import { useAuthStore } from '@/store/useAuthStore';
import Swal from "sweetalert2";

interface ProductoDetalleClientProps {
  product: Product;
}

export default function ProductoDetalleClient({ product }: ProductoDetalleClientProps) {
  const router = useRouter();
  
  // 1. Control de montaje estricto para evitar que el SSR muestre cosas antes de tiempo
  const [isReady, setIsReady] = useState(false); 
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [isBuyingNow, setIsBuyingNow] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  
  const [mainImage, setMainImage] = useState<string>(product?.image || '');
  const [zoomStyle, setZoomStyle] = useState<React.CSSProperties>({ display: 'none' });
  const containerRef = useRef<HTMLDivElement>(null);
  const [isUnlockedForever, setIsUnlockedForever] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  // STORES - Extraemos searchQuery y selectedCategory para la lógica del botón
  const { 
    setCurrentProduct, 
    searchQuery, 
    activeCategory // Cambiado de selectedCategory a activeCategory
  } = useProductStore();
  const addToCart = useCartStore((state) => state.addToCart);
  const { user } = useAuthStore();

  // Lógica de filtro activo para el botón de volver
  const hayFiltroActivo = searchQuery.trim() !== "" || (activeCategory !== "Todas" && activeCategory !== "Catálogo");

  const allImages = useMemo(() => {
    if (!product) return [];
    return [product.image, product.image2, product.image3].filter(Boolean) as string[];
  }, [product]);

  useEffect(() => {
    if (product) {
      window.scrollTo({ top: 0, behavior: 'instant' });
      setCurrentProduct(product);
      setMainImage(product.image);
      
      const timer = setTimeout(() => setIsReady(true), 20);
      return () => clearTimeout(timer);
    }
  }, [product, setCurrentProduct]);

  const volverAlCatalogo = () => {
    setIsExiting(true);
    setTimeout(() => {
      router.push('/productos');
    }, 150);
  };

  if (!product) {
    return (
      <div className="pt-40 text-center font-black uppercase opacity-20 text-[var(--foreground)]">
        Producto no encontrado
      </div>
    );
  }

  const esOferta = String(product.isOferta) === "true";
  const descuentoNum = Number(product.descuento || 0);
  const precioOriginal = Number(product.price) || 0;
  const precioFinal = (esOferta && descuentoNum > 0) 
    ? precioOriginal * (1 - (descuentoNum / 100)) 
    : precioOriginal;
  const hasStock = product.stock > 0;

  const handleAddToCart = async () => {
    const userId = user?.id || (user as any)?._id;
    const result = await addToCart({ ...product, price: precioFinal }, userId);
    
    if (result && !result.success) {
      const isDark = document.documentElement.classList.contains('dark');
      Swal.fire({
        title: '¡STOCK LIMITADO!',
        text: `Lo sentimos, solo tenemos ${result.limit} unidades disponibles.`,
        icon: 'warning',
        background: isDark ? '#222222' : '#ffffff',
        color: isDark ? '#ffffff' : '#000000',
        confirmButtonColor: '#2563eb',
        customClass: {
          popup: 'rounded-[2rem] border-2 border-gray-200 dark:border-white/10 shadow-2xl p-8',
          title: 'font-black tracking-tighter uppercase italic text-2xl',
          confirmButton: 'rounded-xl px-10 py-3 font-bold uppercase tracking-widest text-xs',
        },
        backdrop: `rgba(0,0,0,0.85)`
      });
    }
  };

  const handleBuyNow = () => {
    if (!hasStock || !user) return;
    setIsBuyingNow(true);
    router.push("/checkout");
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isUnlockedForever || !containerRef.current || window.innerWidth < 1024) return;
    const { left, top, width, height } = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setIsHovering(true);
    setZoomStyle({
      display: 'block',
      backgroundPosition: `${x}% ${y}%`,
      backgroundImage: `url(${mainImage})`,
      backgroundSize: '280%' 
    });
  };

  return (
    <div className={`transition-opacity duration-500 ${isReady ? 'opacity-100' : 'opacity-0'}`}>
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ 
          opacity: isExiting ? 0 : 1,
          y: isExiting ? -10 : 0
        }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="max-w-7xl mx-auto px-4 sm:px-6 pt-24 sm:pt-32 pb-24"
      >
        {/* BOTÓN VOLVER CON ANIMATE PRESENCE */}
        <div className="h-12 mb-8">
          <AnimatePresence mode="wait">
            <motion.button
              key={hayFiltroActivo ? "filtrado" : "normal"}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              onClick={volverAlCatalogo} 
              className="group flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400"
            >
              <div className="p-2 rounded-full border border-blue-600/20 group-hover:bg-blue-600 group-hover:text-white transition-all">
                <ChevronLeft size={14} />
              </div>
              <span>{hayFiltroActivo ? "Ver Catálogo Completo" : "Volver al Catálogo"}</span>
            </motion.button>
          </AnimatePresence>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          {/* GALERÍA */}
          <div className="lg:col-span-7 space-y-6">
            <div
              ref={containerRef}
              onClick={() => { if (!isUnlockedForever) setIsUnlockedForever(true); setIsHovering(true); }}
              onMouseMove={handleMouseMove}
              onMouseLeave={() => { setIsHovering(false); setZoomStyle({ display: 'none' }); }}
              className={`relative aspect-square rounded-[2.5rem] sm:rounded-[3rem] overflow-hidden bg-white dark:bg-neutral-900/30 border border-[var(--border-theme)] shadow-2xl group transition-all duration-300 ${
                isUnlockedForever ? 'cursor-crosshair' : 'cursor-zoom-in'
              }`}
            >
              <Image
                src={mainImage} 
                alt={product.name} 
                fill 
                priority 
                quality={100}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 800px"
                onLoad={() => setIsImageLoading(false)}
                className={`object-contain p-8 sm:p-12 transition-all duration-700 ${
                  isImageLoading ? 'opacity-0 scale-95 blur-2xl' : 
                  (isHovering && isUnlockedForever ? 'opacity-0 scale-110' : 'opacity-100 scale-100')
                }`}
              />

              {isUnlockedForever && isHovering && (
                <div
                  className="absolute inset-0 pointer-events-none bg-no-repeat z-10"
                  style={zoomStyle}
                />
              )}

              {!isUnlockedForever && (
                <div className="absolute inset-0 bg-black/5 dark:bg-white/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20">
                   <div className="bg-black/60 backdrop-blur-md text-white px-5 py-3 rounded-full flex items-center gap-3 shadow-2xl">
                      <ZoomIn size={18} />
                      <span className="text-[10px] font-black uppercase tracking-widest">Click para inspeccionar</span>
                   </div>
                </div>
              )}

              {esOferta && (
                <div className="absolute top-8 left-8 z-20 bg-blue-600 text-white px-4 py-1.5 rounded-full font-black text-[9px] uppercase tracking-widest flex items-center gap-2 shadow-lg border border-white/10">
                  <Zap size={14} fill="currentColor" className="animate-pulse" /> -{descuentoNum}% OFF
                </div>
              )}
            </div>

            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
              {allImages.map((img, i) => (
                <button
                  key={i} 
                  onClick={() => { setMainImage(img); setZoomStyle({ display: 'none' }); }}
                  className={`relative w-20 h-24 sm:w-24 sm:h-28 rounded-[2rem] overflow-hidden bg-white dark:bg-neutral-800 border transition-all duration-500 p-3 shrink-0 flex items-center justify-center ${
                    mainImage === img 
                      ? 'border-blue-600 ring-4 ring-blue-600/15' 
                      : 'opacity-40 hover:opacity-100 border-[var(--border-theme)]'
                  }`}
                >
                  <div className="relative w-full h-full">
                      <Image 
                        src={img} 
                        alt={`miniatura-${i+1}`} 
                        fill 
                        quality={60} 
                        sizes="100px"
                        className="object-contain" 
                      />
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* INFORMACIÓN */}
          <div className="lg:col-span-5 flex flex-col gap-8 lg:sticky lg:top-32 pt-2">
              <header className="space-y-4">
                  <div className="flex items-center gap-3 opacity-60">
                      <span className="h-[1px] w-8 bg-blue-600"></span>
                      <p className="text-[10px] sm:text-[11px] font-black uppercase tracking-[0.3em] text-[var(--foreground)]">{product.category || "Hardware"}</p>
                  </div>
                  <h1 className="text-4xl lg:text-5xl font-black text-[var(--foreground)] tracking-tighter leading-[1] uppercase break-words">
                    {product.name}
                  </h1>
                  <div className="flex items-center gap-1 text-amber-500 pt-1">
                    {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                    <span className="ml-2 text-[10px] font-black tracking-widest uppercase italic opacity-40">Original Philco Product</span>
                  </div>
              </header>

              <div className="py-8 border-y border-[var(--border-theme)]/60">
                <div className="flex items-baseline gap-4">
                  <p className="text-6xl sm:text-7xl font-black text-[var(--foreground)] tracking-tighter leading-none">
                    <span className="text-blue-600 text-3xl mr-1">$</span>
                    {precioFinal.toLocaleString('es-AR')}
                  </p>
                  {esOferta && (
                    <p className="text-xl sm:text-2xl font-bold text-red-500/40 line-through tracking-tighter">
                      ${precioOriginal.toLocaleString('es-AR')}
                    </p>
                  )}
                </div>
              </div>

              <p className="text-[var(--foreground)] opacity-60 leading-relaxed text-base sm:text-lg italic font-medium">
                {product.description}
              </p>

              <div className="space-y-4 pt-4">
                <button 
                  onClick={handleBuyNow} 
                  disabled={!hasStock || !user} 
                  className={`w-full h-20 rounded-full font-black text-[11px] uppercase tracking-[0.4em] transition-all border-2 shadow-2xl hover:scale-[1.02] active:scale-[0.98] ${
                    (hasStock && user)
                      ? 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700 shadow-blue-600/30' 
                      : 'bg-neutral-200 dark:bg-neutral-800 text-neutral-500 border-neutral-300 dark:border-neutral-800 cursor-not-allowed opacity-70'
                  }`}
                >
                  {!user ? "Ingresa para comprar" : isBuyingNow ? "Iniciando Checkout..." : "Comprar Ahora"}
                </button>
                
                <button 
                  onClick={handleAddToCart} 
                  disabled={!hasStock || !user} 
                  className={`w-full h-20 rounded-full font-black text-[11px] uppercase tracking-[0.4em] transition-all border-2 ${
                    (hasStock && user)
                      ? 'border-[var(--border-theme)]/80 hover:bg-[var(--foreground)] hover:text-[var(--background)]'
                      : 'border-neutral-300 dark:border-neutral-800 text-neutral-400 cursor-not-allowed opacity-50'
                  }`}
                >
                  <span className="flex items-center justify-center gap-3">
                    <ShoppingCart size={20} />
                    {!user ? "Debes iniciar sesión" : "Añadir al Carrito"}
                  </span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
                <div className="flex items-center gap-5 p-6 rounded-[2.3rem] bg-neutral-500/5 dark:bg-white/5 border border-[var(--border-theme)]/50">
                    <div className="p-3 bg-blue-600/10 rounded-2xl"><Truck size={22} className="text-blue-600" /></div>
                    <div>
                      <p className="text-[10px] font-black uppercase text-[var(--foreground)]">Envío Express</p>
                      <p className="text-[9px] opacity-40 uppercase font-bold text-[var(--foreground)]">Todo el País</p>
                    </div>
                </div>
                <div className="flex items-center gap-5 p-6 rounded-[2.3rem] bg-neutral-500/5 dark:bg-white/5 border border-[var(--border-theme)]/50">
                    <div className="p-3 bg-emerald-500/10 rounded-2xl"><ShieldCheck size={22} className="text-emerald-500" /></div>
                    <div>
                      <p className="text-[10px] font-black uppercase text-[var(--foreground)]">Garantía</p>
                      <p className="text-[9px] opacity-40 uppercase font-bold text-[var(--foreground)]">Oficial Philco</p>
                    </div>
                </div>
              </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}