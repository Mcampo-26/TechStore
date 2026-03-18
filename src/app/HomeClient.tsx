"use client";

import React, { useEffect } from 'react';
import { Truck, ShieldCheck, CreditCard, Clock } from 'lucide-react';
import { ProductCard } from '@/components/products/ProductCard';
import { Product } from '@/types';
import { BrandBanner } from '@/components/Home/BrandBanner';
import { PromoBanner } from '@/components/Home/PromoBanner';
import { useProductStore } from '@/store/useProductStore'; // Importamos el store
import { SearchInput } from '@/components/layout/SearchInput'; // Importamos tu nuevo buscador

interface Props {
  initialProducts: Product[];
}

export default function HomeClient({ initialProducts }: Props) {
  // Traemos lo necesario del Store
  const { filteredProducts, setProducts, searchQuery } = useProductStore();

  // Sincronizamos los productos destacados con el store al cargar
  useEffect(() => {
    if (initialProducts) {
      setProducts(initialProducts);
    }
  }, [initialProducts, setProducts]);

  // Usamos filteredProducts del store para la grilla
  // Si el store está vacío al inicio, usamos initialProducts como fallback
  const displayProducts = (filteredProducts.length === 0 && searchQuery === "") 
    ? initialProducts 
    : filteredProducts;

  return (
    <div className="transition-colors duration-300 mt-10" style={{ backgroundColor: 'var(--background)' }}>
      <PromoBanner />

      {/* Sección de Beneficios */}
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

      <section className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <h2 className="text-3xl font-black tracking-tighter border-l-8 border-blue-600 pl-4"
              style={{ color: 'var(--foreground)' }}>
            PRODUCTOS <span className="text-blue-600">DESTACADOS</span>
          </h2>

          {/* REEMPLAZO: Ahora usamos el SearchInput unificado */}
          <div className="w-full md:w-80">
            <SearchInput />
          </div>
        </div>

        {/* Grilla de productos usando el Store */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {displayProducts.map((product) => (
            <ProductCard key={product.id || (product as any)._id} product={product} />
          ))}
        </div>

        {displayProducts.length === 0 && (
          <div className="text-center py-20 rounded-[2rem] border border-dashed"
               style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-theme)' }}>
            <p className="opacity-50 text-lg" style={{ color: 'var(--foreground)' }}>
              No encontramos resultados para "<span className="font-bold opacity-100">{searchQuery}</span>"
            </p>
          </div>
        )}
      </section>

      <div className="border-t transition-colors" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-theme)' }}>
        <BrandBanner />
      </div>
    </div>
  );
}