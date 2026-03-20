"use client";

import React, { useEffect, useState, useRef, useMemo } from "react";
import { useProductStore } from "@/store/useProductStore";
import { Product } from "@/types";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams, useRouter } from "next/navigation";
import {
  ChevronLeft,
  Zap,
  Star,
  ShoppingCart,
  Truck,
  ShieldCheck,
  ArrowUpRight,
  ZoomIn,
  ZoomOut
} from "lucide-react";
import Image from 'next/image';
import { useCartStore } from '@/store/useCartStore';
import { useAuthStore } from '@/store/useAuthStore';
import Swal from "sweetalert2";
import { LoaderProducts } from "@/components/ui/LoaderProducts";

// Definición estricta de la interfaz para evitar el error en page.tsx
interface ProductoDetalleClientProps {
  product: Product;
}

export default function ProductoDetalleClient({ product }: ProductoDetalleClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // --- 1. TODOS LOS HOOKS VAN AQUÍ ARRIBA (ORDEN ESTRICTO) ---

  const [mounted, setMounted] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [isBuyingNow, setIsBuyingNow] = useState(false);

  // Inicializamos con el producto si existe, si no string vacío
  const [mainImage, setMainImage] = useState<string>(product?.image || '');
  const [zoomStyle, setZoomStyle] = useState<React.CSSProperties>({ display: 'none' });
  const containerRef = useRef<HTMLDivElement>(null);

  // Estado de liberación total para el zoom
  const [isUnlockedForever, setIsUnlockedForever] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  // Stores
  const { setCurrentProduct } = useProductStore();
  const addToCart = useCartStore((state) => state.addToCart);
  const { user } = useAuthStore();

  // El useMemo DEBE ir antes de cualquier return condicional
  const allImages = useMemo(() => {
    if (!product) return [];
    return [product.image, product.image2, product.image3].filter(Boolean) as string[];
  }, [product]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && product) {
      // Reset scroll al entrar
      window.scrollTo({ top: 0, behavior: 'instant' });

      // Sincronizar store
      setCurrentProduct(product);
      setMainImage(product.image);

      // Resetear estados de zoom al cambiar de producto
      setIsUnlockedForever(false);
      setIsHovering(false);

      const timer = setTimeout(() => {
        setIsPageLoading(false);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [product, setCurrentProduct, mounted]);

  // --- 2. RETORNOS CONDICIONALES (DESPUÉS DE LOS HOOKS) ---

  const showMasterLoader = isPageLoading || isImageLoading;

  if (!mounted) return null;

  if (!product) return <LoaderProducts productName="CARGANDO..." />;

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
    if (!hasStock) return;
    setIsBuyingNow(true);
    setTimeout(() => router.push("/checkout"), 500);
  };

  // ZOOM HÍBRIDO
  const handleFirstClick = () => {
    if (!isUnlockedForever) {
      setIsUnlockedForever(true);
      setIsHovering(true);
    }
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

  const handleMouseLeave = () => {
    setIsHovering(false);
    setZoomStyle({ display: 'none' });
  };

  return (
    <>
      <AnimatePresence mode="wait">
        {showMasterLoader && (
          <motion.div key="product-loader-container" className="fixed inset-0 z-[100]">
            <LoaderProducts
              productName={product?.name?.toUpperCase() || "PRODUCTO"}
            />
            <div className="hidden">
              <Image
                src={product.image}
                alt="preload"
                width={10}
                height={10}
                priority
                onLoad={() => setIsImageLoading(false)}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className={`max-w-7xl mx-auto px-4 sm:px-6 pt-24 sm:pt-32 pb-24 transition-all duration-1000 ${showMasterLoader ? 'opacity-0 scale-95 blur-xl' : 'opacity-100 scale-100 blur-0'
        }`}>

        <div className="h-12 mb-8">
          <button
            onClick={() => router.push('/productos')}
            className="group flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400"
          >
            <div className="p-2 rounded-full border border-blue-600/20 group-hover:bg-blue-600 group-hover:text-white transition-all">
              <ChevronLeft size={14} />
            </div>
            <span>Volver al Catálogo</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">

          <div className="lg:col-span-7 space-y-6">
            <div
              ref={containerRef}
              onClick={handleFirstClick}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              className={`relative aspect-square rounded-[2.5rem] sm:rounded-[3rem] overflow-hidden bg-white dark:bg-neutral-900/30 border border-[var(--border-theme)] shadow-2xl group transition-all duration-300 ${isUnlockedForever ? 'cursor-crosshair' : 'cursor-zoom-in'
                }`}
            >
              <Image
                src={mainImage}
                alt={product.name}
                fill
                priority
                quality={100}
                className={`object-contain p-8 sm:p-12 transition-all duration-500 ${isHovering && isUnlockedForever ? 'opacity-0 scale-110' : 'opacity-100 scale-100'
                  }`}
              />

              {isUnlockedForever && (
                <div
                  className="absolute inset-0 pointer-events-none bg-no-repeat transition-opacity duration-300 z-10"
                  style={isHovering ? zoomStyle : { display: 'none' }}
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
              {allImages.map((img, i) => {
                const isActiveThumbnail = mainImage === img;

                return (
                  <button
                    key={i}
                    onClick={() => {
                      setMainImage(img);
                      setZoomStyle({ display: 'none' });
                    }}
                    className={`relative w-20 h-24 sm:w-24 sm:h-28 rounded-[2rem] overflow-hidden bg-white dark:bg-neutral-800 border transition-all duration-500 p-3 shrink-0 flex items-center justify-center ${isActiveThumbnail
                        ? 'border-blue-600 ring-4 ring-blue-600/15'
                        : 'opacity-40 hover:opacity-100 hover:border-blue-600/50 border-[var(--border-theme)]'
                      }`}
                  >
                    <div className="relative w-full h-full">
                      <Image src={img} alt={`miniatura-${i + 1}`} fill quality={60} className="object-contain" />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

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

            <p className="text-[var(--foreground)] opacity-60 leading-relaxed text-base sm:text-lg italic">
              {product.description}
            </p>

            <div className="space-y-4 pt-4">
              <button
                onClick={handleBuyNow}
                disabled={!hasStock}
                className={`w-full h-20 rounded-full font-black text-[11px] uppercase tracking-[0.4em] transition-all border-2 shadow-2xl hover:scale-[1.02] active:scale-[0.98] ${hasStock
                    ? 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700 shadow-blue-600/30'
                    : 'bg-neutral-800 text-neutral-500 border-neutral-800 cursor-not-allowed opacity-50'
                  }`}
              >
                {isBuyingNow ? "Iniciando Checkout..." : "Comprar Ahora"}
              </button>
              <button
                onClick={handleAddToCart}
                disabled={!hasStock}
                className="w-full h-20 rounded-full font-black text-[11px] uppercase tracking-[0.4em] transition-all border-2 border-[var(--border-theme)]/80 hover:bg-[var(--foreground)] hover:text-[var(--background)] hover:border-[var(--foreground)]"
              >
                <span className="flex items-center justify-center gap-3">
                  <ShoppingCart size={20} />
                  Añadir al Carrito
                </span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
              <div className="flex items-center gap-5 p-6 rounded-[2.3rem] bg-neutral-500/5 dark:bg-white/5 border border-[var(--border-theme)]/50 transition-colors hover:bg-neutral-500/10 dark:hover:bg-white/10">
                <div className="p-3 bg-blue-600/10 rounded-2xl"><Truck size={22} className="text-blue-600" /></div>
                <div>
                  <p className="text-[10px] font-black uppercase text-[var(--foreground)]">Envío Express</p>
                  <p className="text-[9px] opacity-40 uppercase font-bold text-[var(--foreground)]">Todo el País</p>
                </div>
              </div>
              <div className="flex items-center gap-5 p-6 rounded-[2.3rem] bg-neutral-500/5 dark:bg-white/5 border border-[var(--border-theme)]/50 transition-colors hover:bg-neutral-500/10 dark:hover:bg-white/10">
                <div className="p-3 bg-emerald-500/10 rounded-2xl"><ShieldCheck size={22} className="text-emerald-500" /></div>
                <div>
                  <p className="text-[10px] font-black uppercase text-[var(--foreground)]">Garantía</p>
                  <p className="text-[9px] opacity-40 uppercase font-bold text-[var(--foreground)]">Oficial Philco</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}