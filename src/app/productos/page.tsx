"use client";

import React, { useEffect, useState, Suspense } from 'react';
import { Search, FilterX } from 'lucide-react';
import { ProductCard } from '@/components/products/ProductCard';
import { useProductStore } from '@/store/useProductStore';
import { Product } from '@/types';
import { useSearchParams } from 'next/navigation'; // <--- Importante

// En Next.js, cuando usas useSearchParams es obligatorio envolver en Suspense
export default function ProductosPage() {
  return (
    <Suspense fallback={<div className="pt-32 text-center text-gray-500">Cargando buscador...</div>}>
      <ProductosContent />
    </Suspense>
  );
}

function ProductosContent() {
  const { products, setProducts, isLoading, setLoading } = useProductStore();
  const [searchTerm, setSearchTerm] = useState('');
  
  // 1. Obtener la categoría de la URL (?categoria=Celulares)
  const searchParams = useSearchParams();
  const categoriaURL = searchParams.get('categoria');

  useEffect(() => {
    setLoading(true);
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [setProducts, setLoading]);

  // 2. LÓGICA DE FILTRADO DOBLE (Nombre + Categoría)
  const filtered = products.filter((p: Product) => {
    // Filtro por nombre
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filtro por categoría (si no hay categoría en URL, pasan todos)
    const matchesCategory = categoriaURL 
      ? p.category?.toLowerCase() === categoriaURL.toLowerCase() 
      : true;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-[#f5f5f5] pt-28 pb-12 px-4">
      <div className="max-w-7xl mx-auto">
        
        {/* CABECERA Y BUSCADOR */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              {categoriaURL ? `Categoría: ${categoriaURL}` : "Todos los productos"}
            </h1>
            {categoriaURL && (
               <p className="text-sm text-gray-500">Los mejores productos </p>
            )}
          </div>
          
          <div className="relative w-full md:w-96">
            <input 
              type="text"
              placeholder="Buscar en esta sección..."
              className="w-full p-3 pl-10 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-[#3483fa] bg-white"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-3.5 text-gray-400" size={18} />
          </div>
        </div>

        {/* GRID DE PRODUCTOS */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3483fa]"></div>
          </div>
        ) : (
          <>
            {filtered.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filtered.map((product: Product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
                <FilterX className="mx-auto text-gray-300 mb-4" size={48} />
                <h2 className="text-xl font-bold text-gray-700">No hay resultados</h2>
                <p className="text-gray-400 mt-2">
                  No encontramos productos en {categoriaURL || "la tienda"} que coincidan con "{searchTerm}"
                </p>
                <button 
                  onClick={() => window.location.href = '/productos'}
                  className="mt-6 text-[#3483fa] font-bold hover:underline"
                >
                  Ver todos los productos
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}