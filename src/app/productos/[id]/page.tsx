"use client";

import React, { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/store/useCartStore';
import { useAuthStore } from '@/store/useAuthStore';
import { 
  ArrowLeft, ShoppingCart, ShieldCheck, Truck, Star, 
  CheckCircle2, User, Zap, CreditCard, RotateCcw, Info 
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
    <div className="h-screen flex items-center justify-center bg-[#f4f7f9] text-[10px] font-black tracking-[0.3em] text-slate-400 animate-pulse">
      LOADING_PRODUCT...
    </div>
  );

  if (!product) return <div className="h-screen flex items-center justify-center">Producto no encontrado</div>;

  const allImages = [product.image, (product as any).image2, (product as any).image3].filter(Boolean);
  const esOferta = (product as any).isOferta === true || (product as any).isOferta === "true";
  const descuentoNum = Number((product as any).descuento || (product as any).descuentoPorcentaje || 0);
  const precioOriginal = Number(product.price) || 0;
  const precioFinal = (esOferta && descuentoNum > 0) ? precioOriginal * (1 - (descuentoNum / 100)) : precioOriginal;

  return (
    <div className="min-h-screen bg-[#f4f7f9] pt-32 pb-20 px-6">
      <div className="max-w-6xl mx-auto">
        
        {/* BOTÓN VOLVER */}
        <button
          onClick={() => router.back()}
          className="group flex items-center gap-3 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] hover:text-blue-600 transition-all mb-8"
        >
          <div className="bg-white p-2 rounded-full shadow-sm group-hover:shadow-md transition-all">
            <ArrowLeft size={14} />
          </div>
          Volver al listado
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* COLUMNA IZQUIERDA: IMÁGENES */}
          <div className="lg:col-span-7 bg-white rounded-[2.5rem] p-8 border border-white shadow-sm flex flex-col items-center">
            <div className="w-full aspect-square flex items-center justify-center bg-slate-50 rounded-[2rem] mb-6 overflow-hidden">
              <img
                src={mainImage}
                alt={product.name}
                className="max-h-[80%] max-w-[80%] object-contain hover:scale-110 transition-transform duration-500"
              />
            </div>
            <div className="flex gap-4">
              {allImages.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setMainImage(img)}
                  className={`w-20 h-20 rounded-2xl p-2 bg-slate-50 transition-all border-2 ${
                    mainImage === img ? 'border-blue-500 shadow-md' : 'border-transparent opacity-60'
                  }`}
                >
                  <img src={img} className="w-full h-full object-contain" alt="thumbnail" />
                </button>
              ))}
            </div>
          </div>

          {/* COLUMNA DERECHA: COMPRA */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="bg-white rounded-[2.5rem] p-10 border border-white shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <span className="bg-blue-600/10 text-blue-600 text-[10px] font-black px-2 py-1 rounded-lg uppercase tracking-widest">Nuevo</span>
                <div className="flex text-yellow-400"><Star size={12} fill="currentColor" /></div>
                <span className="text-xs text-slate-400 font-bold">4.9 (42 reseñas)</span>
              </div>

              <h1 className="text-3xl font-bold text-slate-900 leading-tight mb-4 tracking-tight">
                {product.name}
              </h1>

              <div className="mb-8">
                {esOferta && descuentoNum > 0 && (
                  <span className="text-lg text-slate-400 line-through font-medium">$ {precioOriginal.toLocaleString('es-AR')}</span>
                )}
                <div className="flex items-center gap-3">
                  <span className="text-5xl font-black text-slate-900 tracking-tighter">
                    $ {precioFinal.toLocaleString('es-AR')}
                  </span>
                  {esOferta && <span className="bg-emerald-500 text-white text-xs font-black px-2 py-1 rounded-md">{descuentoNum}% OFF</span>}
                </div>
              </div>

              {/* INFO DE ENVÍO Y PAGO */}
              <div className="space-y-4 mb-8 border-t border-slate-50 pt-8">
                <div className="flex items-center gap-4">
                  <div className="bg-blue-50 p-3 rounded-2xl text-blue-600"><Truck size={20} /></div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">Envío gratis a todo el país</p>
                    <p className="text-xs text-slate-500">Llega entre mañana y el miércoles</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="bg-purple-50 p-3 rounded-2xl text-purple-600"><CreditCard size={20} /></div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">Hasta 6 cuotas sin interés</p>
                    <p className="text-xs text-slate-500">Con tarjetas de crédito seleccionadas</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {isLoggedIn ? (
                  <button
                    onClick={handleAddToCart}
                    disabled={product.stock < 1}
                    className={`w-full py-5 rounded-2xl font-bold text-sm tracking-widest transition-all shadow-xl shadow-slate-200 uppercase flex items-center justify-center gap-3 group ${
                      product.stock < 1 ? 'bg-gray-400 cursor-not-allowed' : 'bg-slate-900 text-white hover:bg-blue-600'
                    }`}
                  >
                    <ShoppingCart size={18} />
                    {product.stock < 1 ? 'Sin Stock' : 'Agregar al carrito'}
                  </button>
                ) : (
                  <Link href="/login" className="block text-center w-full bg-slate-100 text-slate-600 py-5 rounded-2xl font-bold text-sm tracking-widest hover:bg-slate-200 transition-all uppercase">
                    Ingresar para comprar
                  </Link>
                )}
              </div>
            </div>

            {/* GARANTÍAS */}
            <div className="bg-slate-900/5 rounded-[2rem] p-6 border border-white flex justify-between gap-4">
                <div className="flex flex-col items-center text-center gap-2">
                    <ShieldCheck size={20} className="text-slate-600" />
                    <span className="text-[9px] font-black uppercase text-slate-500 tracking-tighter leading-none">Compra<br/>Protegida</span>
                </div>
                <div className="flex flex-col items-center text-center gap-2">
                    <RotateCcw size={20} className="text-slate-600" />
                    <span className="text-[9px] font-black uppercase text-slate-500 tracking-tighter leading-none">30 días de<br/>devolución</span>
                </div>
                <div className="flex flex-col items-center text-center gap-2">
                    <CheckCircle2 size={20} className="text-slate-600" />
                    <span className="text-[9px] font-black uppercase text-slate-500 tracking-tighter leading-none">Garantía de<br/>fábrica</span>
                </div>
            </div>
          </div>

          {/* COLUMNA ABAJO: DESCRIPCIÓN Y ESPECIFICACIONES */}
          <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-[2.5rem] p-10 border border-white shadow-sm">
                <h3 className="text-lg font-black text-slate-900 uppercase tracking-widest mb-6 flex items-center gap-2">
                    <Info size={18} className="text-blue-600" /> Descripción
                </h3>
                <p className="text-slate-600 leading-relaxed whitespace-pre-line text-sm">
                    {product.description || "Este producto no tiene una descripción detallada todavía."}
                </p>
            </div>
            
            <div className="bg-white rounded-[2.5rem] p-10 border border-white shadow-sm">
                <h3 className="text-lg font-black text-slate-900 uppercase tracking-widest mb-6 flex items-center gap-2">
                    <Zap size={18} className="text-blue-600" /> Especificaciones
                </h3>
                <div className="space-y-3">
                    {/* Ejemplo de tabla de specs: podrías mapear un array si lo tienes en el modelo */}
                    <div className="flex justify-between py-3 border-b border-slate-50">
                        <span className="text-xs font-bold text-slate-400 uppercase">Categoría</span>
                        <span className="text-xs font-bold text-slate-900">{product.category}</span>
                    </div>
                    <div className="flex justify-between py-3 border-b border-slate-50">
                        <span className="text-xs font-bold text-slate-400 uppercase">Estado</span>
                        <span className="text-xs font-bold text-slate-900">En stock ({product.stock} unidades)</span>
                    </div>
                    <div className="flex justify-between py-3">
                        <span className="text-xs font-bold text-slate-400 uppercase">Garantía</span>
                        <span className="text-xs font-bold text-slate-900">12 meses oficial</span>
                    </div>
                </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}