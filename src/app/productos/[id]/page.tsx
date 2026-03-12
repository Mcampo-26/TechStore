"use client";

import React, { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/store/useCartStore';
import { useAuthStore } from '@/store/useAuthStore';
import { ArrowLeft, ShoppingCart, ShieldCheck, Truck, Star, CheckCircle2, User, Zap } from 'lucide-react';
import Link from 'next/link';
import { Product } from '@/types';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function ProductoDetalle({ params }: PageProps) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;
  const router = useRouter();
  
  const addToCart = useCartStore((state) => state.addToCart);
  const { user, isLoggedIn } = useAuthStore();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [mainImage, setMainImage] = useState<string>('');

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

  const handleAddToCart = () => {
    if (!product) return;
    const userId = user?.id || (user as any)?._id;
    addToCart(product, userId);
  };

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-[#f4f7f9] text-[10px] font-black tracking-[0.3em] text-slate-400">
      LOADING_PRODUCT
    </div>
  );

  if (!product) return <div className="h-screen flex items-center justify-center">Producto no encontrado</div>;

  // --- NUEVA LÓGICA DE PRECIOS ULTRA-SEGURA ---
  const allImages = [product.image, (product as any).image2, (product as any).image3].filter(Boolean);
  
  // 1. Detectar si es oferta (soporta booleano o string)
  const esOferta = (product as any).isOferta === true || (product as any).isOferta === "true";
  
  // 2. Buscar el descuento en posibles nombres de campo y convertir a número
  const descuentoRaw = (product as any).descuento || (product as any).descuentoPorcentaje || 0;
  const descuentoNum = Number(descuentoRaw);
  
  // 3. Precios
  const precioOriginal = Number(product.price) || 0;
  const precioFinal = (esOferta && descuentoNum > 0) 
    ? precioOriginal * (1 - (descuentoNum / 100)) 
    : precioOriginal;

  return (
    <div className="min-h-screen bg-[#f4f7f9] pt-32 pb-20 px-6">
      <div className="max-w-5xl mx-auto">
        
        <div className="flex justify-between items-center mb-8">
          <button 
            onClick={() => router.back()} 
            className="group flex items-center gap-3 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] hover:text-blue-600 transition-all"
          >
            <div className="bg-white p-2 rounded-full shadow-sm group-hover:shadow-md transition-all">
              <ArrowLeft size={14} />
            </div>
            Volver al listado
          </button>

          {/* Banner superior estilo "Oferta Relámpago" */}
          {esOferta && (
            <div className="flex items-center gap-2 bg-white border border-blue-100 text-blue-600 px-4 py-2 rounded-xl shadow-sm">
              <Zap size={14} fill="#2563eb" className="animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-widest">Oferta Relámpago</span>
            </div>
          )}
        </div>

        <div className="bg-slate-50/80 backdrop-blur-xl border border-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] overflow-hidden flex flex-col md:flex-row relative">
          
          {/* Badge verde: Solo se muestra si el descuento es mayor a 0 */}
          {esOferta && descuentoNum > 0 && (
  <div className="absolute top-4 left-4 z-10 pointer-events-none">
    <div className="relative flex items-center gap-2 bg-emerald-600 text-white px-3 py-1.5 rounded-md shadow-lg">

      {/* Punta tipo etiqueta */}
      <span className="absolute -left-1.5 w-3 h-3 bg-emerald-600 rotate-45" />

      <span className="text-[9px] uppercase tracking-wider opacity-90">
        OFF
      </span>

      <span className="text-[13px] font-black leading-none">
        -{descuentoNum}%
      </span>

    </div>
  </div>
)}

          <div className="w-full md:w-[55%] p-8 md:p-12 flex flex-col items-center bg-white/40 border-r border-white">
            <div className="w-full aspect-square flex items-center justify-center bg-white rounded-[2rem] shadow-inner p-8 mb-8 border border-slate-100/50">
              <img 
                src={mainImage} 
                alt={product.name} 
                className="max-h-full max-w-full object-contain transition-transform duration-700 hover:scale-105" 
              />
            </div>
            
            <div className="flex gap-4">
              {allImages.map((img, i) => (
                <button 
                  key={i} 
                  onClick={() => setMainImage(img)}
                  className={`w-16 h-16 rounded-2xl p-2 bg-white transition-all duration-300 border-2 ${
                    mainImage === img ? 'border-blue-500 shadow-lg shadow-blue-100' : 'border-transparent opacity-50 hover:opacity-100'
                  }`}
                >
                  <img src={img} className="w-full h-full object-contain" alt="thumbnail" />
                </button>
              ))}
            </div>
          </div>

          <div className="w-full md:w-[45%] p-10 md:p-14 flex flex-col">
            <div className="flex items-center gap-2 mb-6">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
              </div>
              <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Top Rated Item</span>
            </div>

            <h1 className="text-3xl font-bold text-slate-900 leading-[1.1] mb-6 tracking-tight">
              {product.name}
            </h1>

            <div className="bg-white/60 p-6 rounded-3xl border border-white shadow-sm mb-10">
              <div className="flex flex-col">
                {esOferta && descuentoNum > 0 && (
                  <span className="text-sm text-slate-400 line-through font-medium mb-1">
                    $ {precioOriginal.toLocaleString('es-AR')}
                  </span>
                )}
                <div className="flex items-center gap-3">
                  <span className="text-4xl font-black text-slate-900 tracking-tighter">
                    $ {precioFinal.toLocaleString('es-AR')}
                  </span>
                  {esOferta && descuentoNum > 0 && (
                    <span className="text-[#00a650] font-bold text-sm">
                      {descuentoNum}% OFF
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 mt-4 text-blue-600 font-bold text-[11px] uppercase tracking-widest">
                <CheckCircle2 size={14} /> Envío Prioritario Bonificado
              </div>
            </div>

            <div className="space-y-4">
              {isLoggedIn ? (
                <button 
                  onClick={handleAddToCart}
                  disabled={product.stock < 1}
                  className={`w-full py-5 rounded-2xl font-bold text-sm tracking-widest transition-all shadow-xl shadow-slate-200 uppercase flex items-center justify-center gap-3 group ${
                    product.stock < 1 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-[#1e293b] text-white hover:bg-blue-600'
                  }`}
                >
                  <ShoppingCart size={18} className="group-hover:-translate-y-1 transition-transform" />
                  {product.stock < 1 ? 'Sin Stock Disponible' : 'Agregar al carrito'}
                </button>
              ) : (
                <Link href="/login" className="block">
                  <button className="w-full bg-slate-200 text-slate-600 py-5 rounded-2xl font-bold text-sm tracking-widest hover:bg-slate-300 transition-all uppercase flex items-center justify-center gap-3">
                    <User size={18} />
                    Ingresar para comprar
                  </button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}