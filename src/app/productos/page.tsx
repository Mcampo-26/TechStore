"use client";

import React, { useEffect, useState, Suspense } from 'react';
import { Search, FilterX } from 'lucide-react';
import { ProductCard } from '@/components/products/ProductCard';
import { useProductStore } from '@/store/useProductStore';
import { Product } from '@/types';
import { useSearchParams } from 'next/navigation';

// --- COMPONENTE PADRE CON SUSPENSE ---
export default function ProductosPage() {
  return (
    <Suspense 
      fallback={
        <div className="min-h-screen pt-32 text-center flex flex-col items-center justify-center transition-colors duration-300"
             style={{ backgroundColor: 'var(--background)', color: 'var(--foreground)' }}>
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-[10px] font-black tracking-widest uppercase">Cargando buscador...</p>
        </div>
      }
    >
      <ProductosContent />
    </Suspense>
  );
}

// --- CONTENIDO REAL DE PRODUCTOS ---
function ProductosContent() {
  // Extraemos las acciones y el estado del Store
  // Nota: He reemplazado setProducts por fetchProducts, que es la acción que debe manejar el fetch
  const { products, fetchProducts, isLoading } = useProductStore();
  const [searchTerm, setSearchTerm] = useState('');
  
  const searchParams = useSearchParams();
  const categoriaURL = searchParams.get('categoria');

  // Delegamos la carga de datos al Store
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Lógica de filtrado
  const filtered = products.filter((p: Product) => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoriaURL 
      ? p.category?.toLowerCase() === categoriaURL.toLowerCase() 
      : true;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen pt-28 pb-12 px-4 transition-colors duration-300"
         style={{ backgroundColor: 'var(--background)' }}>
      
      <div className="max-w-7xl mx-auto">
        
        {/* CABECERA Y BUSCADOR */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-3xl font-black tracking-tight" style={{ color: 'var(--foreground)' }}>
              {categoriaURL ? `Categoría: ${categoriaURL}` : "Todos los productos"}
            </h1>
            <p className="text-sm opacity-50 font-medium" style={{ color: 'var(--foreground)' }}>
              {filtered.length} productos encontrados
            </p>
          </div>
          
          <div className="relative w-full md:w-96 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 opacity-40 group-focus-within:text-blue-500 group-focus-within:opacity-100 transition-all" 
                    size={20} 
                    style={{ color: 'var(--foreground)' }} />
            <input 
              type="text"
              placeholder="¿Qué estás buscando?"
              className="w-full p-4 pl-12 rounded-2xl border outline-none focus:ring-4 focus:ring-blue-500/10 transition-all shadow-sm"
              style={{ 
                backgroundColor: 'var(--card-bg)', 
                borderColor: 'var(--border-theme)',
                color: 'var(--foreground)' 
              }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* GRID DE PRODUCTOS O LOADING */}
        {isLoading && products.length === 0 ? (
          <div className="flex justify-center items-center h-64">
            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            {filtered.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {filtered.map((product: Product) => (
                  <ProductCard key={product._id || product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-24 rounded-[3rem] border border-dashed transition-colors"
                   style={{ 
                     backgroundColor: 'var(--card-bg)', 
                     borderColor: 'var(--border-theme)' 
                   }}>
                <FilterX className="mx-auto mb-6 opacity-20" size={64} style={{ color: 'var(--foreground)' }} />
                <h2 className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>Sin resultados</h2>
                <p className="opacity-50 mt-2 max-w-xs mx-auto text-sm" style={{ color: 'var(--foreground)' }}>
                  No encontramos productos que coincidan con tu búsqueda en {categoriaURL || "nuestra tienda"}.
                </p>
                <button 
                  onClick={() => {
                    setSearchTerm('');
                    window.history.replaceState(null, '', '/productos');
                  }}
                  className="mt-8 px-8 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-500 transition-all shadow-lg shadow-blue-500/20"
                >
                  Ver todo el catálogo
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}