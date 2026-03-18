"use client";

import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image'; // <--- El componente estrella de Next.js
import { useCartStore } from '@/store/useCartStore';
import { useAuthStore } from '@/store/useAuthStore';
import { useProductStore } from '@/store/useProductStore';
import Swal from "sweetalert2"
import {
    ArrowLeft, ShoppingCart, ShieldCheck, Star,
    CheckCircle2, RotateCcw, Truck, Info, Zap
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
    const { user } = useAuthStore();

    const [isBuyingNow, setIsBuyingNow] = useState(false);
    const [mainImage, setMainImage] = useState<string>(product?.image || '');

    // Estados para el efecto Lupa
    const [zoomStyle, setZoomStyle] = useState<React.CSSProperties>({ display: 'none' });
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (product) {
            setCurrentProduct(product);
            setMainImage(product.image);
        }
    }, [product, setCurrentProduct]);

    if (!product) return null;

    // Lógica de Precios
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
          // Detectamos si el sistema está en modo oscuro
          const isDark = document.documentElement.classList.contains('dark');
      
          Swal.fire({
            title: '¡STOCK LIMITADO!',
            text: `Lo sentimos, solo tenemos ${result.limit} unidades disponibles de este producto.`,
            icon: 'warning',
            position: 'center',
            showConfirmButton: true,
            confirmButtonText: 'ENTENDIDO',
            confirmButtonColor: '#2563eb',
      
            // --- SOLUCIÓN DEFINITIVA AL FONDO MEZCLADO ---
            // Forzamos colores hexadecimales sólidos para que no haya transparencia
            background: isDark ? '#222222' : '#ffffff',
            color: isDark ? '#ffffff' : '#000000',
            
            customClass: {
              // Añadimos border sólido para separar bien de la imagen de fondo
              popup: 'rounded-[2rem] border-2 border-gray-200 dark:border-white/10 shadow-2xl p-8', 
              title: 'font-black tracking-tighter uppercase italic text-2xl',
              confirmButton: 'rounded-xl px-10 py-3 font-bold uppercase tracking-widest text-xs',
              htmlContainer: 'font-medium'
            },
            // Oscurecemos el fondo de la página para que la alerta resalte más
            backdrop: `rgba(0,0,0,0.85)` 
          });
        }
      };

    const handleBuyNow = () => {
        if (!hasStock) return;
        setIsBuyingNow(true);        
        setTimeout(() => router.push("/checkout"), 500);
    };

    // Manejo de Lupa
    const handleMouseMove = (e: React.MouseEvent) => {
        if (!containerRef.current) return;
        const { left, top, width, height } = containerRef.current.getBoundingClientRect();
        const x = ((e.clientX - left) / width) * 100;
        const y = ((e.clientY - top) / height) * 100;

        setZoomStyle({
            display: 'block',
            backgroundPosition: `${x}% ${y}%`,
            backgroundImage: `url(${mainImage})`,
            backgroundSize: '200%' // Zoom de 2x
        });
    };

    const allImages = [product.image, product.image2, product.image3].filter(Boolean) as string[];

    return (
        <div className="max-w-7xl mx-auto px-4 py-12">
            {/* BOTÓN VOLVER */}
            <button 
                onClick={() => router.back()}
                className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest opacity-50 hover:opacity-100 transition-all mb-8"
            >
                <ArrowLeft size={16} /> Volver al catálogo
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                
                {/* COLUMNA IZQUIERDA: IMÁGENES */}
                <div className="space-y-4">
                    <div 
                        ref={containerRef}
                        onMouseMove={handleMouseMove}
                        onMouseLeave={() => setZoomStyle({ display: 'none' })}
                        className="relative aspect-square rounded-[3rem] overflow-hidden bg-white border border-[var(--border-theme)] cursor-zoom-in"
                    >
                        {/* IMAGEN PRINCIPAL CON NEXT/IMAGE */}
                        <Image 
                            src={mainImage} 
                            alt={product.name}
                            fill
                            priority // Hace que la imagen cargue PRIMERO que todo
                            className="object-contain p-8"
                        />
                        
                        {/* CAPA DE LUPA */}
                        <div 
  className="absolute inset-0 pointer-events-none transition-opacity duration-300"
  style={{
    ...zoomStyle, 
    backgroundSize: '150%' // Esto sobrescribe el zoom y lo hace más pequeño
  }}
/>

                        {esOferta && (
                            <div className="absolute top-6 left-6 bg-blue-600 text-white px-4 py-2 rounded-2xl font-black text-xs uppercase tracking-tighter flex items-center gap-2 shadow-xl shadow-blue-600/30">
                                <Zap size={14} fill="white" /> -{descuentoNum}% OFF
                            </div>
                        )}
                    </div>

                    {/* MINIATURAS */}
                    <div className="flex gap-4">
                        {allImages.map((img, i) => (
                            <button 
                                key={i}
                                onClick={() => setMainImage(img)}
                                className={`w-24 h-24 rounded-2xl border-2 overflow-hidden bg-white p-2 transition-all ${mainImage === img ? 'border-blue-600 scale-105 shadow-lg' : 'border-transparent opacity-60 hover:opacity-100'}`}
                            >
                                <Image src={img} alt="thumb" width={100} height={100} className="object-contain w-full h-full" />
                            </button>
                        ))}
                    </div>
                </div>

                {/* COLUMNA DERECHA: INFO */}
                <div className="flex flex-col gap-6">
                    <div>
                        <p className="text-blue-500 font-black text-xs uppercase tracking-[0.3em] mb-2">{product.category}</p>
                        <h1 className="text-4xl md:text-5xl font-black text-[var(--foreground)] tracking-tighter leading-none mb-4">{product.name}</h1>
                        <div className="flex items-center gap-2">
                            <div className="flex text-amber-400"><Star size={14} fill="currentColor"/><Star size={14} fill="currentColor"/><Star size={14} fill="currentColor"/><Star size={14} fill="currentColor"/><Star size={14} fill="currentColor"/></div>
                            <span className="text-[10px] font-bold opacity-30">(45 Reseñas)</span>
                        </div>
                    </div>

                    <div className="py-6 border-y border-[var(--border-theme)]">
                        {esOferta && (
                            <p className="text-sm font-bold text-red-500 line-through opacity-50 mb-1">${precioOriginal.toLocaleString()}</p>
                        )}
                        <p className="text-5xl font-black text-[var(--foreground)] tracking-tight">
                            ${precioFinal.toLocaleString()}
                        </p>
                    </div>

                    <p className="text-[var(--foreground)] opacity-70 leading-relaxed font-medium">{product.description}</p>

                    {/* ACCIONES */}
                    <div className="space-y-4 pt-4">
                        <div className="flex gap-4">
                            <button 
                                onClick={handleBuyNow}
                                disabled={!hasStock}
                                className={`flex-[2] py-5 rounded-[2rem] font-black text-xs uppercase tracking-widest transition-all ${hasStock ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/30 hover:scale-[1.02] active:scale-95' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
                            >
                                {isBuyingNow ? "Procesando..." : "Comprar Ahora"}
                            </button>
                            <button 
                                onClick={handleAddToCart}
                                disabled={!hasStock}
                                className="flex-1 py-5 rounded-[2rem] border-2 border-[var(--border-theme)] flex items-center justify-center gap-2 hover:bg-[var(--foreground)] hover:text-[var(--background)] transition-all active:scale-95"
                            >
                                <ShoppingCart size={20} />
                            </button>
                        </div>

                        {/* INFO EXTRA */}
                        <div className="grid grid-cols-2 gap-4 mt-6">
                            <div className="flex items-center gap-3 p-4 rounded-3xl bg-[var(--card-bg)] border border-[var(--border-theme)]">
                                <Truck size={20} className="text-blue-500" />
                                <div className="leading-none"><p className="text-[10px] font-black uppercase mb-1">Envío Gratis</p><p className="text-[9px] opacity-40 font-bold">Todo el país</p></div>
                            </div>
                            <div className="flex items-center gap-3 p-4 rounded-3xl bg-[var(--card-bg)] border border-[var(--border-theme)]">
                                <ShieldCheck size={20} className="text-emerald-500" />
                                <div className="leading-none"><p className="text-[10px] font-black uppercase mb-1">Garantía</p><p className="text-[9px] opacity-40 font-bold">12 Meses</p></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}