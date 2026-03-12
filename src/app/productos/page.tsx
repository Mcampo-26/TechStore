"use client";

import React, { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import { ProductCard } from '@/components/products/ProductCard'; // Asegúrate de que la ruta sea correcta
import { useProductStore } from '@/store/useProductStore';
import { Product } from '@/types';

export default function ProductosPage() {
  const { products, setProducts, isLoading, setLoading } = useProductStore();
  const [searchTerm, setSearchTerm] = useState('');

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

  const filtered = products.filter((p: Product) => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#f5f5f5] pt-28 pb-12 px-4">
      <div className="max-w-7xl mx-auto">
        
        {/* CABECERA Y BUSCADOR */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Todos los productos</h1>
          
          <div className="relative w-full md:w-96">
            <input 
              type="text"
              placeholder="Filtrar por nombre..."
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
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filtered.map((product: Product) => (
              /* USAMOS EL COMPONENTE QUE TIENE LAS MINIATURAS */
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}

        {filtered.length === 0 && !isLoading && (
          <div className="text-center py-20 text-gray-500">
            No se encontraron productos que coincidan con "{searchTerm}"
          </div>
        )}
      </div>
    </div>
  );
}