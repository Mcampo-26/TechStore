"use client";

import React, { useEffect, useState, useRef } from "react";
import { useProductStore } from "@/store/useProductStore";
import { Product } from "@/types";
import { motion } from "framer-motion";
import { useSearchParams, useRouter } from "next/navigation";
import { ChevronLeft, Zap, Star, ShoppingCart, Truck, ShieldCheck, ArrowUpRight } from "lucide-react";
import Image from 'next/image';
import { useCartStore } from '@/store/useCartStore';
import { useAuthStore } from '@/store/useAuthStore';
import Swal from "sweetalert2";

interface ProductoDetalleClientProps {
    product: Product;
}

export default function ProductoDetalleClient({ product }: ProductoDetalleClientProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    
    const { setCurrentProduct, searchQuery, setSearchQuery } = useProductStore();
    const addToCart = useCartStore((state) => state.addToCart);
    const { user } = useAuthStore();

    const [isBuyingNow, setIsBuyingNow] = useState(false);
    const [mainImage, setMainImage] = useState<string>(product?.image || '');
    const [zoomStyle, setZoomStyle] = useState<React.CSSProperties>({ display: 'none' });
    const containerRef = useRef<HTMLDivElement>(null);

    const categoriaURL = searchParams.get('categoria');
    const esOfertaFiltro = searchParams.get('oferta') === "true";
    const hayFiltroActivo = !!categoriaURL || esOfertaFiltro || searchQuery !== "";

    // EFECTO PARA POSICIONAR LA PANTALLA ARRIBA AL CARGAR
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'instant' });
        
        if (product) {
            setCurrentProduct(product);
            setMainImage(product.image);
        }
    }, [product, setCurrentProduct]);

    if (!product) return null;

    const esOferta = String(product.isOferta) === "true";
    const descuentoNum = Number(product.descuento || 0);
    const precioOriginal = Number(product.price) || 0;
    const precioFinal = (esOferta && descuentoNum > 0)
        ? precioOriginal * (1 - (descuentoNum / 100))
        : precioOriginal;
    const hasStock = product.stock > 0;

    const volverAlCatalogo = () => {
        if (!hayFiltroActivo) {
            router.push('/productos');
        } else {
            setSearchQuery("");
            router.push('/productos');
        }
    };

    const handleAddToCart = async () => {
        const userId = user?.id || (user as any)?._id;
        const result = await addToCart({ ...product, price: precioFinal }, userId);

        if (result && !result.success) {
            const isDark = document.documentElement.classList.contains('dark');
            Swal.fire({
                title: '¡STOCK LIMITADO!',
                text: `Lo sentimos, solo tenemos ${result.limit} unidades disponibles de este producto.`,
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

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!containerRef.current) return;
        const { left, top, width, height } = containerRef.current.getBoundingClientRect();
        const x = ((e.clientX - left) / width) * 100;
        const y = ((e.clientY - top) / height) * 100;

        setZoomStyle({
            display: 'block',
            backgroundPosition: `${x}% ${y}%`,
            backgroundImage: `url(${mainImage})`,
            backgroundSize: '250%' 
        });
    };

    const allImages = [product.image, product.image2, product.image3].filter(Boolean) as string[];

    return (
        <div className="max-w-7xl mx-auto px-6 pt-32 pb-24">
    
    {/* BOTÓN VOLVER - Minimalista y funcional */}
    <div className="h-12 mb-12">
        <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={volverAlCatalogo}
            className="group flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400 hover:opacity-70 transition-all"
        >
            <div className="p-2 rounded-full border border-blue-600/20 group-hover:bg-blue-600 group-hover:text-white transition-all">
                <ChevronLeft size={14} />
            </div>
            <span>
                {hayFiltroActivo ? "Regresar a la selección" : "Volver al Catálogo"}
            </span>
        </motion.button>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
        
        {/* COLUMNA IZQUIERDA: GALERÍA (7 de 12 columnas para más aire) */}
        <div className="lg:col-span-7 space-y-6">
            <div
                ref={containerRef}
                onMouseMove={handleMouseMove}
                onMouseLeave={() => setZoomStyle({ display: 'none' })}
                className="relative aspect-square rounded-[3.5rem] overflow-hidden bg-[#fdfdfd] dark:bg-neutral-900/40 border border-[var(--border-theme)] shadow-2xl shadow-black/5 dark:shadow-none cursor-crosshair group"
            >
                {/* Imagen Base */}
                <Image
                    src={mainImage}
                    alt={product.name}
                    fill
                    priority
                    className="object-contain p-12 transition-opacity duration-300 group-hover:opacity-0"
                />
                
                {/* Lente de Zoom 90% (Escala 1.9) */}
                <div
                    className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-no-repeat"
                    style={{
                        ...zoomStyle,
                        backgroundImage: `url(${mainImage})`,
                        backgroundSize: '190%', // Esto representa el 90% de aumento sobre el original
                    }}
                />

                {esOferta && (
                    <div className="absolute top-8 left-8 z-10 backdrop-blur-xl bg-blue-600/90 text-white px-5 py-2 rounded-full font-black text-[10px] uppercase tracking-widest flex items-center gap-2 border border-white/10 shadow-xl">
                        <Zap size={14} fill="currentColor" className="animate-pulse" />
                        -{descuentoNum}% OFF
                    </div>
                )}
            </div>

            {/* Miniaturas Minimalistas */}
            <div className="flex gap-4 justify-start overflow-x-auto pb-4 scrollbar-hide">
                {allImages.map((img, i) => (
                    <button
                        key={i}
                        onClick={() => setMainImage(img)}
                        className={`relative w-24 h-28 rounded-[1.8rem] overflow-hidden bg-white dark:bg-neutral-800 border transition-all duration-500 p-3 
                        ${mainImage === img 
                            ? 'border-blue-600 ring-4 ring-blue-600/10' 
                            : 'border-[var(--border-theme)] opacity-40 hover:opacity-100'}`}
                    >
                        <Image src={img} alt="thumb" width={100} height={100} className="object-contain w-full h-full" />
                    </button>
                ))}
            </div>
        </div>

        {/* COLUMNA DERECHA: INFO (5 de 12 columnas) */}
        <div className="lg:col-span-5 flex flex-col gap-8 lg:sticky lg:top-32 pt-4">
            <header>
                <div className="flex items-center gap-3 mb-4 opacity-60">
                    <span className="h-[1px] w-8 bg-blue-600"></span>
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--foreground)]">
                        {product.category}
                    </p>
                </div>
                
                <h1 className="text-5xl font-black text-[var(--foreground)] tracking-tighter leading-[0.95] uppercase mb-6">
                    {product.name}
                </h1>

                <div className="flex items-center gap-4">
                    <div className="flex gap-0.5 text-amber-500">
                        {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                    </div>
                    <span className="text-[10px] font-black uppercase opacity-30 tracking-widest text-[var(--foreground)]">
                        Verified Hardware
                    </span>
                </div>
            </header>

            {/* PRECIO BRUTALISTA */}
            <div className="py-10 border-y border-[var(--border-theme)]/60">
                <div className="flex items-baseline gap-4">
                    <p className="text-7xl font-black text-[var(--foreground)] tracking-tighter">
                        <span className="text-blue-600 dark:text-blue-400 text-3xl mr-1">$</span>
                        {precioFinal.toLocaleString('es-AR')}
                    </p>
                    {esOferta && (
                        <p className="text-xl font-bold text-red-500/40 line-through tracking-tighter">
                            ${precioOriginal.toLocaleString('es-AR')}
                        </p>
                    )}
                </div>
            </div>

            <p className="text-[var(--foreground)] opacity-60 leading-relaxed text-lg font-medium">
                {product.description}
            </p>

            {/* ACCIONES TÉCNICAS */}
            <div className="space-y-4 pt-4">
                <div className="flex gap-3">
                    <button
                        onClick={handleBuyNow}
                        disabled={!hasStock}
                        className={`relative flex-[3] h-20 rounded-full font-black text-[11px] uppercase tracking-[0.3em] transition-all overflow-hidden group
                        ${hasStock 
                            ? 'bg-[var(--foreground)] text-[var(--background)] hover:scale-[1.02] active:scale-95 shadow-2xl shadow-black/10' 
                            : 'bg-neutral-200 dark:bg-neutral-800 text-neutral-400 cursor-not-allowed'}`}
                    >
                        <span className="relative z-10 flex items-center justify-center gap-2">
                            {isBuyingNow ? "Procesando..." : "Adquirir Ahora"}
                            <ArrowUpRight size={18} />
                        </span>
                    </button>

                    <button
                        onClick={handleAddToCart}
                        disabled={!hasStock}
                        className="flex-1 h-20 rounded-full border-2 border-[var(--border-theme)] flex items-center justify-center text-[var(--foreground)] hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all active:scale-95"
                    >
                        <ShoppingCart size={24} />
                    </button>
                </div>

                {/* TRUST CARDS */}
                <div className="grid grid-cols-2 gap-4 mt-8">
                    <div className="flex flex-col gap-3 p-6 rounded-[2.5rem] bg-neutral-500/5 dark:bg-white/5 border border-[var(--border-theme)]/50">
                        <Truck size={20} className="text-blue-600" />
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-tighter text-[var(--foreground)]">Envío Express</p>
                            <p className="text-[9px] opacity-40 font-bold uppercase">Argentina / 24h</p>
                        </div>
                    </div>
                    <div className="flex flex-col gap-3 p-6 rounded-[2.5rem] bg-neutral-500/5 dark:bg-white/5 border border-[var(--border-theme)]/50">
                        <ShieldCheck size={20} className="text-emerald-500" />
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-tighter text-[var(--foreground)]">Garantía Oficial</p>
                            <p className="text-[9px] opacity-40 font-bold uppercase">12 Meses Cert.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
    )
}