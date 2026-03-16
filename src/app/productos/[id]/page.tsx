"use client";

import React, { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/store/useCartStore';
import { useAuthStore } from '@/store/useAuthStore';
import { useProductStore } from '@/store/useProductStore'; // <-- Importado
import { 
  ArrowLeft, ShoppingCart, ShieldCheck, Truck, Star, 
  CheckCircle2, Zap, RotateCcw, Info 
} from 'lucide-react';
import Link from 'next/link';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function ProductoDetalle({ params }: PageProps) {
  const { id } = use(params);
  const router = useRouter();
  
  // Store de Productos
  const { currentProduct: product, fetchProductById, isLoading } = useProductStore();
  
  // Store de Carrito y Auth
  const addToCart = useCartStore((state) => state.addToCart);
  const { user, isLoggedIn } = useAuthStore();

  const [isBuyingNow, setIsBuyingNow] = useState(false);
  const [mainImage, setMainImage] = useState<string>('');

  // 1. Efecto centralizado para cargar el producto
  useEffect(() => {
    fetchProductById(id).then((data) => {
      if (data) setMainImage(data.image);
    });
  }, [id, fetchProductById]);

  // --- LÓGICA DE PRECIOS ---
  if (!product && !isLoading) return <div className="h-screen flex items-center justify-center">Producto no encontrado</div>;
  if (isLoading || !product) return (
    <div className="h-screen flex items-center justify-center transition-colors duration-300"
         style={{ backgroundColor: 'var(--background)', color: 'var(--foreground)' }}>
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-[10px] font-black tracking-[0.3em] animate-pulse uppercase">Cargando Producto...</p>
      </div>
    </div>
  );

  const esOferta = String(product.isOferta) === "true";
  const descuentoNum = Number(product.descuento || product.descuentoPorcentaje || 0);
  const precioOriginal = Number(product.price) || 0;
  const precioFinal = (esOferta && descuentoNum > 0) ? precioOriginal * (1 - (descuentoNum / 100)) : precioOriginal;
  const hasStock = product.stock > 0;

  // --- ACCIONES ---
  const handleBuyNow = () => {
    if (!hasStock) return;
    setIsBuyingNow(true);
    const userId = user?.id || (user as any)?._id;
    addToCart({ ...product, price: precioFinal }, userId);
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
        
        <button onClick={() => router.back()} className="group flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] mb-8" style={{ color: 'var(--foreground)' }}>
          <div className="p-2 rounded-full border shadow-sm" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-theme)' }}>
            <ArrowLeft size={14} />
          </div>
          <span className="opacity-60 group-hover:opacity-100 group-hover:text-blue-600">Volver al listado</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* IMÁGENES */}
          <div className="lg:col-span-7 rounded-[2.5rem] p-8 border shadow-sm flex flex-col items-center"
               style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-theme)' }}>
            <div className="w-full aspect-square flex items-center justify-center bg-white rounded-[2rem] mb-6 overflow-hidden p-8 shadow-inner">
              <img src={mainImage || product.image} alt={product.name} className="max-h-full max-w-full object-contain hover:scale-105 transition-transform duration-500" />
            </div>
            <div className="flex gap-4">
              {allImages.map((img, i) => (
                <button key={i} onClick={() => setMainImage(img)}
                  className={`w-20 h-20 rounded-2xl p-2 transition-all border-2 bg-white ${mainImage === img ? 'border-blue-500 shadow-md scale-105' : 'border-transparent opacity-40 hover:opacity-100'}`}>
                  <img src={img} className="w-full h-full object-contain" alt={`vista-${i}`} />
                </button>
              ))}
            </div>
          </div>

          {/* COLUMNA COMPRA */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="rounded-[2.5rem] p-10 border shadow-sm" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-theme)' }}>
              <div className="flex items-center gap-2 mb-4">
                <span className="bg-blue-600/10 text-blue-600 text-[10px] font-black px-2 py-1 rounded-lg uppercase tracking-widest">Premium</span>
                <div className="flex text-yellow-400"><Star size={12} fill="currentColor" /></div>
                <span className="text-xs opacity-50 font-bold" style={{ color: 'var(--foreground)' }}>4.9 (42 reseñas)</span>
              </div>

              <h1 className="text-3xl font-bold leading-tight mb-4 tracking-tight" style={{ color: 'var(--foreground)' }}>{product.name}</h1>

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
                    <button onClick={handleBuyNow} disabled={isBuyingNow || !hasStock}
                      className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-500 transition-all flex items-center justify-center disabled:opacity-50 shadow-lg shadow-blue-500/20 active:scale-95">
                      {isBuyingNow ? "Procesando..." : "Comprar ahora"}
                    </button>
                    <button onClick={handleAddToCart} disabled={!hasStock}
                      className="w-full py-5 rounded-2xl font-bold text-sm tracking-widest transition-all uppercase flex items-center justify-center gap-3 border-2"
                      style={{ borderColor: 'var(--border-theme)', color: 'var(--foreground)' }}>
                      <ShoppingCart size={18} />
                      {!hasStock ? 'Sin Stock' : 'Agregar al carrito'}
                    </button>
                  </>
                ) : (
                  <Link href="/login" className="block text-center w-full py-5 rounded-2xl font-bold text-sm tracking-widest uppercase border-2 hover:bg-blue-600 hover:text-white transition-all"
                        style={{ backgroundColor: 'var(--card-bg)', color: 'var(--foreground)', borderColor: 'var(--border-theme)' }}>
                    Ingresar para comprar
                  </Link>
                )}
              </div>

              <div className="space-y-4 border-t pt-8" style={{ borderColor: 'var(--border-theme)' }}>
                <div className="flex items-center gap-4">
                  <div className="bg-blue-500/10 p-3 rounded-2xl text-blue-600"><Truck size={20} /></div>
                  <div>
                    <p className="text-sm font-bold" style={{ color: 'var(--foreground)' }}>Envío gratis</p>
                    <p className="text-xs opacity-50" style={{ color: 'var(--foreground)' }}>Llega en 24-48hs habiles</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}