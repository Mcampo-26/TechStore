"use client";

import React, { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/store/useCartStore';
import { useAuthStore } from '@/store/useAuthStore';
import { ArrowLeft, ShoppingCart, ShieldCheck, Truck, Star, CheckCircle2, User } from 'lucide-react';
import Link from 'next/link';
import { Product } from '@/types'; // Asegúrate de importar tu interfaz

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function ProductoDetalle({ params }: PageProps) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;
  const router = useRouter();
  
  const addToCart = useCartStore((state) => state.addToCart);
  const { user, isLoggedIn } = useAuthStore();

  // Cambiamos any por Product | null para tener autocompletado y seguridad
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [mainImage, setMainImage] = useState<string>('');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${id}`);
        const data = await res.json();
        
        // NORMALIZACIÓN: Nos aseguramos de que tenga 'id' y '_id' para evitar errores de TS
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
    
    // Obtenemos los IDs de forma segura
    const userId = user?.id || (user as any)?._id;
    
    // Llamamos a la función del store (que ya tiene la validación de stock)
    addToCart(product, userId);
  };

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-[#f4f7f9] text-[10px] font-black tracking-[0.3em] text-slate-400">
      LOADING_PRODUCT
    </div>
  );

  if (!product) return <div className="h-screen flex items-center justify-center">Producto no encontrado</div>;

  const allImages = [product.image, (product as any).image2, (product as any).image3].filter(Boolean);

  return (
    <div className="min-h-screen bg-[#f4f7f9] pt-32 pb-20 px-6">
      <div className="max-w-5xl mx-auto">
        
        <button 
          onClick={() => router.back()} 
          className="group flex items-center gap-3 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-8 hover:text-blue-600 transition-all"
        >
          <div className="bg-white p-2 rounded-full shadow-sm group-hover:shadow-md transition-all">
            <ArrowLeft size={14} />
          </div>
          Volver al listado
        </button>

        <div className="bg-slate-50/80 backdrop-blur-xl border border-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] overflow-hidden flex flex-col md:flex-row">
          
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
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-black text-slate-900 tracking-tighter">
                  $ {product.price?.toLocaleString('es-AR')}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-3 text-blue-600 font-bold text-[11px] uppercase tracking-widest">
                <CheckCircle2 size={14} /> Envío Prioritario Bonificado
              </div>
            </div>

            <div className="space-y-4">
              {isLoggedIn ? (
                <button 
                  onClick={handleAddToCart}
                  // Deshabilitar botón si no hay stock
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
              
              <p className="text-[10px] text-slate-400 text-center font-bold uppercase tracking-tighter">
                Stock disponible: {product.stock} unidades
              </p>
            </div>

            <div className="mt-12 pt-8 border-t border-slate-200/50 flex flex-col gap-5">
              <div className="flex items-center gap-4 group">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-400 shadow-sm border border-slate-100 group-hover:text-blue-500 transition-colors">
                  <Truck size={18} />
                </div>
                <div>
                  <h4 className="text-[10px] font-black uppercase text-slate-800 tracking-wider">Despacho Rápido</h4>
                  <p className="text-[10px] text-slate-400">Llega en 48hs hábiles</p>
                </div>
              </div>
              <div className="flex items-center gap-4 group">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-400 shadow-sm border border-slate-100 group-hover:text-blue-500 transition-colors">
                  <ShieldCheck size={18} />
                </div>
                <div>
                  <h4 className="text-[10px] font-black uppercase text-slate-800 tracking-wider">Protección Total</h4>
                  <p className="text-[10px] text-slate-400">Pago 100% encriptado</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 px-8">
          <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-400 mb-8 border-b border-slate-200 pb-4">Detalles técnicos</h3>
          <p className="text-slate-500 text-sm leading-[1.8] font-medium max-w-2xl">
            {product.description}
          </p>
        </div>

      </div>
    </div>
  );
}