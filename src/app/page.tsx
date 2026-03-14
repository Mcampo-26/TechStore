"use client";

import React, { useEffect, useState } from 'react';
import { Search, X, Truck, ShieldCheck, CreditCard, Clock } from 'lucide-react';
import { ProductCard } from '@/components/products/ProductCard';
import { Product } from '@/types';
import { BrandBanner } from '@/components/Home/BrandBanner';
import { PromoBanner } from '@/components/Home/PromoBanner';

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/products');
        const data = await res.json();
        setProducts(data);
      } catch (error) {
        console.error("Error cargando productos:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      /* CAMBIO 1: Loading con fondo adaptable */
      <div className="min-h-screen flex items-center justify-center transition-colors duration-300"
           style={{ backgroundColor: 'var(--background)' }}>
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="animate-pulse font-bold tracking-tighter" style={{ color: 'var(--foreground)' }}>
            TECH<span className="text-blue-600">STORE</span>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="transition-colors duration-300" style={{ backgroundColor: 'var(--background)' }}>
      
      {/* 1. Hero / Banner Principal */}
      <PromoBanner />

      {/* 2. Sección de Beneficios (Movidda aquí para mejor flujo visual) */}
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-8">
        {[
          { icon: <Truck />, title: "Envío Gratis", desc: "En compras mayores a $50k" },
          { icon: <ShieldCheck />, title: "Compra Segura", desc: "Garantía oficial tech" },
          { icon: <CreditCard />, title: "Cuotas Sin Interés", desc: "Con todos los bancos" },
          { icon: <Clock />, title: "Soporte 24/7", desc: "Expertos online" },
        ].map((item, i) => (
          <div key={i} className="flex items-center gap-4 group">
            <div className="p-3 bg-blue-500/10 text-blue-600 rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
              {item.icon}
            </div>
            <div>
              <h4 className="font-bold text-xs md:text-sm" style={{ color: 'var(--foreground)' }}>{item.title}</h4>
              <p className="text-[10px] md:text-xs opacity-50" style={{ color: 'var(--foreground)' }}>{item.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* 3. Sección de Productos */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <h2 className="text-3xl font-black tracking-tighter border-l-8 border-blue-600 pl-4"
              style={{ color: 'var(--foreground)' }}>
            ÚLTIMAS <span className="text-blue-600">VISITAS</span>
          </h2>

          {/* Buscador adaptable */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 opacity-40" size={18} />
            <input 
              type="text"
              placeholder="Filtrar productos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-sm"
              style={{ 
                backgroundColor: 'var(--card-bg)', 
                borderColor: 'var(--border-theme)',
                color: 'var(--foreground)' 
              }}
            />
          </div>
        </div>

        {/* Grilla de productos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {filteredProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>

        {/* Empty State adaptable */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-20 rounded-[2rem] border border-dashed transition-colors"
               style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-theme)' }}>
            <p className="opacity-50 text-lg" style={{ color: 'var(--foreground)' }}>
              No encontramos resultados para "<span className="font-bold opacity-100">{searchTerm}</span>"
            </p>
            <button 
              onClick={() => setSearchTerm('')}
              className="mt-4 text-blue-600 font-bold hover:underline"
            >
              Ver todos los productos
            </button>
          </div>
        )}
      </section>

      {/* 4. Marcas (Banner de logos) */}
      <div className="border-t transition-colors" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-theme)' }}>
        <BrandBanner />
      </div>

    </div>
  );
}