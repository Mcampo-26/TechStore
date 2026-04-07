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

  const volverAtras = () => {
    setIsExiting(true);
    // Damos un pequeño margen para cualquier animación de salida
    setTimeout(() => {
      // router.back() detecta de dónde vino el usuario. 
      // Si vino de "/productos?categoria=Celulares", volverá ahí exactamente.
      router.back();
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
    <div className={`transition-opacity duration-500 ${isReady ? 'opacity-100' : 'opacity-0'} min-h-[90vh] flex flex-col justify-center`}>
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{
          opacity: isExiting ? 0 : 1,
          y: isExiting ? -10 : 0
        }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="max-w-7xl mx-auto px-4 sm:px-6 w-full pt-12 pb-12"
      >
        {/* BOTÓN VOLVER */}
        <div className="h-6 mb-4">
          <button
            onClick={volverAtras}
            className="group flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-blue-600/60 hover:text-blue-600 transition-all"
          >
            <ChevronLeft size={14} />
            <span>Volver</span>
          </button>
        </div>

        {/* CONTENEDOR PRINCIPAL */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:h-[75vh] items-center">

          {/* GALERÍA (IZQUIERDA) */}
          <div className="lg:col-span-7 flex flex-col justify-center h-full">
            <div
              ref={containerRef}
              onClick={() => { if (!isUnlockedForever) setIsUnlockedForever(true); setIsHovering(true); }}
              onMouseMove={handleMouseMove}
              onMouseLeave={() => { setIsHovering(false); setZoomStyle({ display: 'none' }); }}
              className={`relative aspect-[4/3] rounded-[2.5rem] overflow-hidden bg-white dark:bg-neutral-900/30 border border-[var(--border-theme)] shadow-2xl group transition-all duration-300 ${isUnlockedForever ? 'cursor-crosshair' : 'cursor-zoom-in'
                }`}
            >
              <Image
                src={mainImage}
                alt={product.name}
                fill
                priority
                quality={100}
                onLoad={() => setIsImageLoading(false)}
                className={`object-contain p-8 transition-all duration-500 ${isImageLoading ? 'opacity-0 scale-95' :
                    (isHovering && isUnlockedForever ? 'opacity-0 scale-110' : 'opacity-100 scale-100')
                  }`}
              />

              {isUnlockedForever && isHovering && (
                <div className="absolute inset-0 pointer-events-none z-10" style={zoomStyle} />
              )}

              {esOferta && (
                <div className="absolute top-6 left-6 z-20 bg-blue-600 text-white px-3 py-1 rounded-full font-black text-[9px] uppercase tracking-widest flex items-center gap-2 shadow-lg border border-white/10">
                  <Zap size={12} fill="currentColor" /> -{descuentoNum}% OFF
                </div>
              )}
            </div>

            {/* MINIATURAS */}
            <div className="flex gap-3 mt-4 overflow-x-auto pb-2 scrollbar-hide">
              {allImages.map((img, i) => (
                <button
                  key={i}
                  onClick={() => { setMainImage(img); setZoomStyle({ display: 'none' }); }}
                  className={`relative w-16 h-16 rounded-xl overflow-hidden bg-white dark:bg-neutral-800 border transition-all duration-300 p-2 shrink-0 ${mainImage === img ? 'border-blue-600 ring-2 ring-blue-600/20' : 'opacity-40 border-white/5 hover:opacity-100'
                    }`}
                >
                  <Image src={img} alt="min" fill className="object-contain p-1" />
                </button>
              ))}
            </div>
          </div>

          {/* INFORMACIÓN (DERECHA) */}
          <div className="lg:col-span-5 flex flex-col justify-between h-full py-4 overflow-y-auto pr-2 custom-scrollbar">
            <div>
              <header className="space-y-2 mb-4">
                <p className="text-[9px] font-black uppercase tracking-[0.4em] text-blue-500">{product.category || "Hardware"}</p>
                <h1 className="text-3xl xl:text-4xl font-black tracking-tighter leading-none uppercase text-[var(--foreground)]">
                  {product.name}
                </h1>
                <div className="flex items-center gap-1 text-amber-500 pt-1">
                  {[...Array(5)].map((_, i) => <Star key={i} size={10} fill="currentColor" />)}
                  <span className="ml-2 text-[8px] font-black tracking-widest uppercase opacity-30 italic text-[var(--foreground)]">Original Product</span>
                </div>
              </header>

              <div className="py-4 border-y border-[var(--border-theme)]/60 mb-4">
                <div className="flex items-baseline gap-4">
                  <p className="text-5xl font-black tracking-tighter text-[var(--foreground)]">
                    <span className="text-blue-600 text-xl mr-1">$</span>
                    {precioFinal.toLocaleString('es-AR')}
                  </p>
                  {esOferta && (
                    <p className="text-lg font-bold text-red-500/40 line-through tracking-tighter">
                      ${precioOriginal.toLocaleString('es-AR')}
                    </p>
                  )}
                </div>
              </div>

              {/* DESCRIPCIÓN CORREGIDA: Sin cortes, sin hover oculto */}
              <p className="text-[11px] text-[var(--foreground)]/40 leading-relaxed font-medium uppercase tracking-wider mb-8">
                {product.description}
              </p>
            </div>

            <div className="space-y-6">
              <div className="space-y-3">
                {/* Mensaje de aviso: Ahora más visible y con un fondo sutil */}
                {!user && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-center gap-2 py-2 px-4 rounded-lg bg-amber-500/10 border border-amber-500/20 mb-2"
                  >
                    <span className="text-[10px] font-black uppercase tracking-widest text-amber-600 dark:text-amber-500">
                      🔒 Iniciar sesión para comprar
                    </span>
                  </motion.div>
                )}

                {/* Botón Comprar: Gris sólido en light, oscuro en dark */}
                <button
                  onClick={handleBuyNow}
                  disabled={!hasStock || !user}
                  className={`w-full h-14 rounded-xl font-black text-[10px] uppercase tracking-[0.3em] transition-all
      ${!user
                      ? 'bg-neutral-200 dark:bg-neutral-800 text-neutral-400 dark:text-neutral-500 cursor-not-allowed border border-neutral-300 dark:border-neutral-700'
                      : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-600/20 active:scale-[0.98]'
                    } 
      disabled:opacity-80`}
                >
                  {isBuyingNow ? "Procesando..." : "Comprar Ahora"}
                </button>

                {/* Botón Carrito: Fondo muy tenue pero con borde definido */}
                <button
                  onClick={handleAddToCart}
                  disabled={!hasStock || !user}
                  className={`w-full h-14 rounded-xl font-black text-[10px] uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-3
      ${!user
                      ? 'bg-neutral-100 dark:bg-neutral-900/50 text-neutral-400 dark:text-neutral-500 border border-neutral-300 dark:border-neutral-800 cursor-not-allowed'
                      : 'border border-[var(--border-theme)] hover:bg-[var(--foreground)] hover:text-[var(--background)]'
                    } 
      disabled:opacity-80`}
                >
                  <ShoppingCart size={16} className={!user ? 'opacity-30' : ''} />
                  Añadir al Carrito
                </button>
              </div>

              {/* CARACTERÍSTICAS */}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-neutral-500/5 border border-[var(--border-theme)]/50">
                  <Truck size={16} className="text-blue-500" />
                  <span className="text-[8px] font-black uppercase opacity-50 tracking-tighter text-[var(--foreground)]">Envío Gratis</span>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-neutral-500/5 border border-[var(--border-theme)]/50">
                  <ShieldCheck size={16} className="text-emerald-500" />
                  <span className="text-[8px] font-black uppercase opacity-50 tracking-tighter text-[var(--foreground)]">Garantía Oficial</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
