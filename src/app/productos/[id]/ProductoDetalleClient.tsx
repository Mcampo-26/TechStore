"use client";

import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useCartStore } from '@/store/useCartStore';
import { useAuthStore } from '@/store/useAuthStore';
import { useProductStore } from '@/store/useProductStore';
import {
    ArrowLeft, ShoppingCart, ShieldCheck, Star,
    CheckCircle2, RotateCcw, Truck, Info
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

    const esOferta = String(product.isOferta) === "true";
    const descuentoNum = Number(product.descuento || 0);
    const precioOriginal = Number(product.price) || 0;
    const precioFinal = (esOferta && descuentoNum > 0)
        ? precioOriginal * (1 - (descuentoNum / 100))
        : precioOriginal;
    const hasStock = product.stock > 0;

    const handleAddToCart = () => {
        const userId = user?.id || (user as any)?._id;
        addToCart({ ...product, price: precioFinal }, userId);
    };

    const handleBuyNow = () => {
        if (!hasStock) return;
        setIsBuyingNow(true);
        handleAddToCart();
        setTimeout(() => router.push("/checkout"), 500);
    };

    // Función para manejar la Lupa
    const handleMouseMove = (e: React.MouseEvent) => {
        if (!containerRef.current) return;
        const { left, top, width, height } = containerRef.current.getBoundingClientRect();
        const x = ((e.pageX - left - window.scrollX) / width) * 100;
        const y = ((e.pageY - top - window.scrollY) / height) * 100;

        setZoomStyle({
            display: 'block',
            backgroundPosition: `${x}% ${y}%`,
            backgroundImage: `url(${mainImage})`,
        });
    };

    const handleMouseLeave = () => {
        setZoomStyle({ display: 'none' });
    };

    const allImages = [product.image, product.image2, product.image3].filter(Boolean) as string[];

    return (
        <div className="min-h-screen pt-32 pb-20 px-4 md:px-10 transition-colors duration-300" style={{ backgroundColor: 'var(--background)' }}>
            <div className="max-w-[1200px] mx-auto bg-white rounded-xl shadow-sm border overflow-hidden" style={{ borderColor: 'var(--border-theme)', backgroundColor: 'var(--card-bg)' }}>

                {/* NAVEGACIÓN MEJORADA */}
                <div className="px-6 py-4 flex items-center justify-between border-b bg-gray-50/30" style={{ borderColor: 'var(--border-theme)' }}>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => router.back()}
                            className="group flex items-center gap-2 text-[14px] font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                        >
                            <svg
                                width="18"
                                height="18"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="group-hover:-translate-x-1 transition-transform"
                            >
                                <path d="M19 12H5M12 19l-7-7 7-7" />
                            </svg>
                            Volver al listado
                        </button>
                    </div>

                    <div className="flex items-center gap-2 text-[12px] tracking-wide uppercase font-bold opacity-50">
                        <span className="text-gray-500">Categoría</span>
                        <span className="text-gray-300 font-light mx-1">|</span>
                        <span className="text-blue-600/80">{product.category}</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">

                    {/* COLUMNA GALERÍA ADAPTADA (Miniaturas funcionales en Mobile) */}
                    <div className="lg:col-span-8 p-4 md:p-6 flex flex-col md:flex-row gap-4">

                        {/* Miniaturas: Fila en mobile, Columna en Desktop */}
                        <div className="flex flex-row md:flex-col gap-2 order-2 md:order-1 overflow-x-auto md:overflow-y-visible pb-2 md:pb-0 scrollbar-hide">
                            {allImages.map((img, i) => (
                                <button
                                    key={i}
                                    onClick={() => setMainImage(img)}
                                    onMouseEnter={() => setMainImage(img)}
                                    className={`flex-shrink-0 w-16 h-16 md:w-14 md:h-14 rounded-md border-2 overflow-hidden bg-white p-1 transition-all ${mainImage === img ? 'border-blue-500' : 'border-gray-200 hover:border-blue-300'}`}
                                >
                                    <div className="relative w-full h-full">
                                        <Image src={img} alt="thumb" fill className="object-contain" sizes="64px" />
                                    </div>
                                </button>
                            ))}
                        </div>

                        {/* Contenedor Imagen Principal + Lupa */}
                        <div
                            ref={containerRef}
                            onMouseMove={handleMouseMove}
                            onMouseLeave={handleMouseLeave}
                            className="flex-grow flex items-center justify-center bg-white rounded-lg p-4 h-[350px] md:h-[500px] relative overflow-hidden cursor-zoom-in order-1 md:order-2"
                        >
                            <Image
                                src={mainImage}
                                alt={product.name}
                                fill
                                priority
                                className="object-contain p-4 md:p-8"
                                sizes="(max-width: 1024px) 100vw, 700px"
                            />

                            {/* CAPA DE LUPA (Solo visible en PC) */}
                            <div
                                className="absolute inset-0 z-20 pointer-events-none bg-no-repeat bg-white transition-opacity duration-200 hidden md:block"
                                style={{
                                    ...zoomStyle,
                                    backgroundSize: '100%',
                                    opacity: zoomStyle.display === 'block' ? 1 : 0
                                }}
                            />
                        </div>
                    </div>

                    {/* COLUMNA COMPRA */}
                    <div className="lg:col-span-4 border-l p-6 flex flex-col gap-4" style={{ borderColor: 'var(--border-theme)' }}>
                        <div className="space-y-1">
                            <p className="text-xs opacity-50 uppercase font-bold">Nuevo | +100 vendidos</p>
                            <h1 className="text-2xl font-bold leading-tight" style={{ color: 'var(--foreground)' }}>
                                {product.name}
                            </h1>
                            <div className="flex items-center gap-1 mt-2">
                                {[1, 2, 3, 4, 5].map(s => <Star key={s} size={14} className="text-blue-500" fill="currentColor" />)}
                                <span className="text-xs ml-2 opacity-50">(45 opiniones)</span>
                            </div>
                        </div>

                        <div className="py-4">
                            {esOferta && (
                                <span className="text-base opacity-40 line-through" style={{ color: 'var(--foreground)' }}>
                                    $ {precioOriginal.toLocaleString('es-AR')}
                                </span>
                            )}
                            <div className="flex items-center gap-3">
                                <span className="text-4xl font-light" style={{ color: 'var(--foreground)' }}>
                                    $ {precioFinal.toLocaleString('es-AR')}
                                </span>
                                {esOferta && <span className="text-emerald-500 text-lg font-medium">{descuentoNum}% OFF</span>}
                            </div>
                            <p className="text-blue-500 text-sm mt-2 font-medium">en 12x $ {(precioFinal / 12).toLocaleString('es-AR', { maximumFractionDigits: 0 })} sin interés</p>
                        </div>

                        <div className="space-y-4 my-2">
                            <div className="flex gap-3">
                                <Truck size={20} className="text-emerald-500 shrink-0" />
                                <div>
                                    <p className="text-emerald-500 text-sm font-medium">Llega gratis mañana</p>
                                    <p className="text-xs opacity-50">Beneficio Mercado Puntos</p>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <RotateCcw size={20} className="text-emerald-500 shrink-0" />
                                <div>
                                    <p className="text-emerald-500 text-sm font-medium">Devolución gratis</p>
                                    <p className="text-xs opacity-50">Tenés 30 días desde que lo recibís.</p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3 mt-4">
                            <p className="text-base font-bold">Stock disponible</p>
                            <div className="p-3 bg-gray-50 dark:bg-white/5 rounded-lg border text-sm mb-4">
                                Cantidad: <span className="font-bold">1 unidad</span> <span className="opacity-40 text-xs">({product.stock} disponibles)</span>
                            </div>

                            {isLoggedIn ? (
                                <>
                                    <button
                                        onClick={handleBuyNow}
                                        disabled={isBuyingNow || !hasStock}
                                        className="w-full bg-blue-500 text-white h-12 rounded-lg font-bold hover:bg-blue-600 transition-all disabled:opacity-50"
                                    >
                                        {isBuyingNow ? "Procesando..." : "Comprar ahora"}
                                    </button>
                                    <button
                                        onClick={handleAddToCart}
                                        disabled={!hasStock}
                                        className="w-full bg-blue-500/10 text-blue-600 h-12 rounded-lg font-bold hover:bg-blue-500/20 transition-all flex items-center justify-center gap-2"
                                    >
                                        <ShoppingCart size={18} /> Agregar al carrito
                                    </button>
                                </>
                            ) : (
                                <Link href="/login" className="block text-center w-full bg-blue-500 text-white h-12 leading-[48px] rounded-lg font-bold">
                                    Ingresá para comprar
                                </Link>
                            )}
                        </div>

                        <div className="mt-6 space-y-3 text-xs opacity-60">
                            <div className="flex gap-2"><ShieldCheck size={16} /> Compra Protegida</div>
                            <div className="flex gap-2"><CheckCircle2 size={16} /> 12 meses de garantía de fábrica</div>
                        </div>
                    </div>
                </div>

                <div className="p-10 border-t" style={{ borderColor: 'var(--border-theme)' }}>
                    <h2 className="text-2xl mb-6 font-medium">Descripción</h2>
                    <p className="text-lg opacity-70 whitespace-pre-line leading-relaxed max-w-4xl font-medium">
                        {product.description}
                    </p>
                </div>
            </div>
        </div>
    );
}