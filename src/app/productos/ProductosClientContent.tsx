"use client";

import React, { useState, useEffect } from 'react';
import { Product } from '@/types';
import {ProductCard} from '@/components/products/ProductCard';

interface ProductosClientContentProps {
  initialProducts: Product[];
  activeCategory: string;
}

export default function ProductosClientContent({ 
  initialProducts, 
  activeCategory 
}: ProductosClientContentProps) {
  
  // Estado local para los productos mostrados
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(initialProducts);

  // Sincronizar el filtrado cuando cambia la categoría o los productos iniciales
  useEffect(() => {
    // Normalizamos para comparar (quitamos espacios y pasamos a minúsculas)
    const categoriaNormalizada = decodeURIComponent(activeCategory).trim().toLowerCase();

    if (categoriaNormalizada === "todas" || !activeCategory) {
      setFilteredProducts(initialProducts);
    } else {
      const filtered = initialProducts.filter((p) => {
        // Asegúrate de que p.category exista para evitar errores
        return p.category?.toLowerCase().trim() === categoriaNormalizada;
      });
      setFilteredProducts(filtered);
    }
  }, [activeCategory, initialProducts]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-10">
      {filteredProducts.length > 0 ? (
        filteredProducts.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))
      ) : (
        <div className="col-span-full flex flex-col items-center justify-center py-20 opacity-40">
          <p className="text-xl font-black uppercase tracking-widest">
            No hay productos en "{activeCategory}"
          </p>
          <p className="text-sm">Intenta con otra categoría o ver todo el catálogo.</p>
        </div>
      )}
    </div>
  );
}