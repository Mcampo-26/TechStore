"use client";

import React, { useEffect, useState } from 'react';
import { Search, X } from 'lucide-react';
import { ProductCard } from '@/components/products/ProductCard';
import { Product } from '@/types';
import { BrandBanner } from '@/components/Home/BrandBanner';
import { PromoBanner } from '@/components/Home/PromoBanner';

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  // 1. Cargar productos desde tu API
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

  // 2. Lógica de filtrado
  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-[#f8fafc] text-blue-600 font-medium">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="animate-pulse">Cargando TechStore...</p>
        </div>
      </div>
    );
  }

  return (
    // Quitamos Navbar y Footer de aquí porque ya están en el Layout
    <div className="bg-[#f8fafc]">
      
      {/* 1. Hero / Banner Principal */}
      <PromoBanner />

      {/* 2. Sección de Productos */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <h2 className="text-3xl font-black text-slate-900 tracking-tighter border-l-8 border-blue-600 pl-4">
            ÚLTIMAS <span className="text-blue-600">VISITAS</span>
          </h2>

          {/* Buscador integrado opcional aquí si quieres usar searchTerm */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text"
              placeholder="Filtrar en esta sección..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-sm"
            />
          </div>
        </div>

        {/* Grilla de productos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {filteredProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>

        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-20 bg-white rounded-[2rem] shadow-sm border border-dashed border-slate-200">
            <p className="text-slate-400 text-lg">
              No encontramos resultados para "<span className="font-bold text-slate-600">{searchTerm}</span>"
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

      {/* 3. Marcas (Antes del footer para que la transición sea limpia) */}
      <div className="bg-white">
        <BrandBanner />
      </div>

    </div>
  );
}