"use client";

import React, { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/store/useCartStore';
import { useAuthStore } from '@/store/useAuthStore';
import { 
  ArrowLeft, ShoppingCart, ShieldCheck, Truck, Star, 
  CheckCircle2, Zap, RotateCcw, Info 
} from 'lucide-react';
import Link from 'next/link';
import { Product } from '@/types';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function ProductoDetalle({ params }: PageProps) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;
  const router = useRouter();
  
  const [isBuyingNow, setIsBuyingNow] = useState(false);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [mainImage, setMainImage] = useState<string>('');

  const addToCart = useCartStore((state) => state.addToCart);
  const { user, isLoggedIn } = useAuthStore();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${id}`);
        const data = await res.json();
        const normalizedProduct = {
          ...data,
          id: data._id || data.id
        };
        setProduct(normalizedProduct);
        setMainImage(data.image);
      } catch (err) {
        console.error("Error cargando producto:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  // --- LÓGICA DE PRECIOS Y ESTADOS ---
  const esOferta = product ? (String(product.isOferta) === "true") : false;
  const descuentoNum = product ? Number(product.descuento || product.descuentoPorcentaje || 0) : 0;
  const precioOriginal = product ? Number(product.price) || 0 : 0;
  const precioFinal = (esOferta && descuentoNum > 0) ? precioOriginal * (1 - (descuentoNum / 100)) : precioOriginal;
  const hasStock = product && product.stock > 0;

  // --- ACCIONES ---
  const handleBuyNow = () => {
    if (!product || !hasStock) return;
    setIsBuyingNow(true);
    // Agregamos al carrito antes de ir al checkout para asegurar que el producto esté ahí
    const userId = user?.id || (user as any)?._id;
    addToCart({ ...product, price: precioFinal }, userId);
    
    setTimeout(() => {
      router.push("/checkout");
    }, 800);
  };

  const handleAddToCart = () => {
    if (!product) return;
    const userId = user?.id || (user as any)?._id;
    addToCart({
      ...product,
      price: precioFinal,
    }, userId);
  };

  if (loading) return (
    <div className="h-screen flex items-center justify-center transition-colors duration-300"
         style={{ backgroundColor: 'var(--background)', color: 'var(--foreground)' }}>
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-[10px] font-black tracking-[0.3em] animate-pulse uppercase">Cargando Producto...</p>
      </div>
    </div>
  );

  if (!product) return <div className="h-screen flex items-center justify-center">Producto no encontrado</div>;

  const allImages = [product.image, product.image2, product.image3].filter(Boolean) as string[];

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 transition-colors duration-300" 
         style={{ backgroundColor: 'var(--background)' }}>
      <div className="max-w-6xl mx-auto">
        
        <button
          onClick={() => router.back()}
          className="group flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] transition-all mb-8"
          style={{ color: 'var(--foreground)' }}
        >
          <div className="p-2 rounded-full border shadow-sm"
               style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-theme)' }}>
            <ArrowLeft size={14} />
          </div>
          <span className="opacity-60 group-hover:opacity-100 group-hover:text-blue-600">Volver al listado</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* IMÁGENES */}
          <div className="lg:col-span-7 rounded-[2.5rem] p-8 border shadow-sm flex flex-col items-center"
               style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-theme)' }}>
            <div className="w-full aspect-square flex items-center justify-center bg-white rounded-[2rem] mb-6 overflow-hidden p-8 shadow-inner">
              <img src={mainImage} alt={product.name} className="max-h-full max-w-full object-contain hover:scale-105 transition-transform duration-500" />
            </div>
            <div className="flex gap-4">
              {allImages.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setMainImage(img)}
                  className={`w-20 h-20 rounded-2xl p-2 transition-all border-2 bg-white ${
                    mainImage === img ? 'border-blue-500 shadow-md scale-105' : 'border-transparent opacity-40 hover:opacity-100'
                  }`}
                >
                  <img src={img} className="w-full h-full object-contain" alt={`vista-${i}`} />
                </button>
              ))}
            </div>
          </div>

          {/* COLUMNA COMPRA */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="rounded-[2.5rem] p-10 border shadow-sm transition-all"
                 style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-theme)' }}>
              
              <div className="flex items-center gap-2 mb-4">
                <span className="bg-blue-600/10 text-blue-600 text-[10px] font-black px-2 py-1 rounded-lg uppercase tracking-widest">Nuevo</span>
                <div className="flex text-yellow-400"><Star size={12} fill="currentColor" /></div>
                <span className="text-xs opacity-50 font-bold" style={{ color: 'var(--foreground)' }}>4.9 (42 reseñas)</span>
              </div>

              <h1 className="text-3xl font-bold leading-tight mb-4 tracking-tight" style={{ color: 'var(--foreground)' }}>
                {product.name}
              </h1>

              <div className="mb-8">
                {esOferta && (
                  <span className="text-lg opacity-40 line-through font-medium" style={{ color: 'var(--foreground)' }}>
                    $ {precioOriginal.toLocaleString('es-AR')}
                  </span>
                )}
                <div className="flex items-center gap-3">
                  <span className="text-5xl font-black tracking-tighter" style={{ color: 'var(--foreground)' }}>
                    $ {precioFinal.toLocaleString('es-AR')}
                  </span>
                  {esOferta && <span className="bg-emerald-500 text-white text-xs font-black px-2 py-1 rounded-md">{descuentoNum}% OFF</span>}
                </div>
              </div>

              <div className="space-y-4 mb-8">
                {isLoggedIn ? (
                  <>
                    <button 
                      onClick={handleBuyNow}
                      disabled={isBuyingNow || !hasStock}
                      className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-500 transition-all flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/20 active:scale-95"
                    >
                      {isBuyingNow ? (
                        <div className="flex items-center gap-3">
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>Procesando...</span>
                        </div>
                      ) : (
                        "Comprar ahora"
                      )}
                    </button>

                    <button
                      onClick={handleAddToCart}
                      disabled={!hasStock}
                      className={`w-full py-5 rounded-2xl font-bold text-sm tracking-widest transition-all uppercase flex items-center justify-center gap-3 border-2 ${
                        !hasStock ? 'bg-gray-400 opacity-50' : 'bg-transparent hover:bg-blue-600 hover:text-white'
                      }`}
                      style={{ borderColor: 'var(--border-theme)', color: 'var(--foreground)' }}
                    >
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
                    <p className="text-sm font-bold" style={{ color: 'var(--foreground)' }}>Envío gratis a todo el país</p>
                    <p className="text-xs opacity-50" style={{ color: 'var(--foreground)' }}>Llega entre mañana y el miércoles</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="rounded-[2rem] p-6 border flex justify-between gap-4"
                 style={{ backgroundColor: 'var(--nav-bg)', borderColor: 'var(--border-theme)' }}>
                <div className="flex flex-col items-center text-center gap-2">
                    <ShieldCheck size={20} className="text-blue-500" />
                    <span className="text-[9px] font-black uppercase opacity-60 tracking-tighter leading-none" style={{ color: 'var(--foreground)' }}>Compra<br/>Protegida</span>
                </div>
                <div className="flex flex-col items-center text-center gap-2">
                    <RotateCcw size={20} className="text-blue-500" />
                    <span className="text-[9px] font-black uppercase opacity-60 tracking-tighter leading-none" style={{ color: 'var(--foreground)' }}>30 días de<br/>devolución</span>
                </div>
                <div className="flex flex-col items-center text-center gap-2">
                    <CheckCircle2 size={20} className="text-blue-500" />
                    <span className="text-[9px] font-black uppercase opacity-60 tracking-tighter leading-none" style={{ color: 'var(--foreground)' }}>Garantía de<br/>fábrica</span>
                </div>
            </div>
          </div>

          {/* DESCRIPCIÓN Y ESPECIFICACIONES */}
          <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="rounded-[2.5rem] p-10 border shadow-sm" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-theme)' }}>
                <h3 className="text-lg font-black uppercase tracking-widest mb-6 flex items-center gap-2" style={{ color: 'var(--foreground)' }}>
                  <Info size={18} className="text-blue-600" /> Descripción
                </h3>
                <p className="opacity-70 leading-relaxed whitespace-pre-line text-sm" style={{ color: 'var(--foreground)' }}>
                  {product.description || "Este producto no tiene una descripción detallada todavía."}
                </p>
            </div>
            
            <div className="rounded-[2.5rem] p-10 border shadow-sm" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-theme)' }}>
                <h3 className="text-lg font-black uppercase tracking-widest mb-6 flex items-center gap-2" style={{ color: 'var(--foreground)' }}>
                  <Zap size={18} className="text-blue-600" /> Especificaciones
                </h3>
                <div className="space-y-3">
                    <div className="flex justify-between py-3 border-b" style={{ borderColor: 'var(--border-theme)' }}>
                        <span className="text-xs font-bold opacity-40 uppercase">Categoría</span>
                        <span className="text-xs font-bold">{product.category}</span>
                    </div>
                    <div className="flex justify-between py-3">
                        <span className="text-xs font-bold opacity-40 uppercase">Garantía</span>
                        <span className="text-xs font-bold">12 meses oficial</span>
                    </div>
                </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}