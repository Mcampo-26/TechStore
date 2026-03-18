"use client";

import React, { useEffect, useMemo } from "react";
import { useProductStore } from "@/store/useProductStore";
import { Product } from "@/types";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { SearchInput } from "@/components/layout/SearchInput";
import { ChevronLeft } from "lucide-react"; // Usamos lucide para el icono

interface Props {
  initialProducts: Product[];
  activeCategory: string;
}

export default function ProductosClientContent({ initialProducts = [], activeCategory }: Props) {
  const { filteredProducts, setProducts, filterByCategory, filterByOffers, searchQuery, setSearchQuery } = useProductStore();
  const searchParams = useSearchParams();
  const router = useRouter();

  const categoriaURL = searchParams.get('categoria');
  const esOferta = searchParams.get('oferta') === "true";
  
  // Determinamos si el usuario está viendo algo filtrado
  const hayFiltroActivo = !!categoriaURL || esOferta || searchQuery !== "";

  useEffect(() => {
    if (initialProducts && initialProducts.length > 0) {
      setProducts(initialProducts);
      if (esOferta) {
        filterByOffers();
      } else if (categoriaURL) {
        filterByCategory(categoriaURL);
      }
    }
  }, [initialProducts, categoriaURL, esOferta, setProducts, filterByCategory, filterByOffers]);

  const productsToDisplay = useMemo(() => {
    const isFiltering = searchQuery !== "" || !!categoriaURL || esOferta;
    if (!isFiltering && filteredProducts.length === 0) return initialProducts;
    return filteredProducts;
  }, [filteredProducts, initialProducts, searchQuery, categoriaURL, esOferta]);

  // Función para resetear todo y volver al catálogo base
  const volverAlCatalogo = () => {
    setSearchQuery("");
    router.push('/productos');
  };

  return (
    <div className="min-h-screen max-w-7xl mx-auto px-4 pt-24 pb-20">
      
      {/* Botón Volver (Solo se muestra si hay filtros) */}
      <div className="h-10 mb-2">
        <AnimatePresence>
          {hayFiltroActivo && (
            <motion.button
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              onClick={volverAlCatalogo}
              className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-blue-600 hover:text-blue-800 transition-colors"
            >
              <ChevronLeft size={16} />
              Volver al Catálogo Completo
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Cabecera */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div className="flex-1">
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter" style={{ color: 'var(--foreground)' }}>
            {esOferta ? "Ofertas Especiales" : (categoriaURL || activeCategory || "Catálogo")}
          </h1>
          <p className="text-sm font-bold opacity-40 mt-2 uppercase tracking-widest">
            {productsToDisplay.length} Productos encontrados
          </p>
        </div>

        <div className="w-full md:w-80">
          <SearchInput />
        </div>
      </div>

      {/* Grilla de productos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        <AnimatePresence mode="popLayout">
          {productsToDisplay.map((product) => {
            const id = product._id || (product as any).id;
            return (
              <motion.div
                key={id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
              >
                <Link
                  href={`/productos/${id}`}
                  className="group block p-5 border rounded-[2.5rem] transition-all hover:shadow-2xl hover:-translate-y-2 flex flex-col h-full bg-[var(--card-bg)] border-[var(--border-theme)]"
                >
                  <div className="relative w-full h-52 mb-6 bg-white rounded-[1.5rem] overflow-hidden p-6">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110"
                    />
                    {product.isOferta && (
                      <div className="absolute top-4 left-4 z-10 bg-red-600 text-white text-[10px] font-black px-3 py-1.5 rounded-lg uppercase shadow-lg">
                        Oferta
                      </div>
                    )}
                  </div>

                  <h3 className="font-bold text-xl line-clamp-2 flex-grow px-2" style={{ color: 'var(--foreground)' }}>
                    {product.name}
                  </h3>

                  <div className="mt-6 px-2 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] opacity-40 font-bold uppercase">Precio contado</p>
                      <p className="text-2xl font-black text-blue-600">
                        ${Number(product.price).toLocaleString('es-AR')}
                      </p>
                    </div>
                    <div className="bg-blue-600/10 p-3 rounded-2xl text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      <span className="text-sm font-bold">Ver</span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Estado vacío mejorado */}
      {productsToDisplay.length === 0 && (
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-40 border-2 border-dashed border-[var(--border-theme)] rounded-[3rem] bg-[var(--card-bg)]/30"
        >
          <p className="font-black uppercase tracking-[0.3em] text-sm opacity-40 mb-6">No hay resultados para esta búsqueda</p>
          <button 
            onClick={volverAlCatalogo}
            className="text-xs font-black uppercase bg-blue-600 text-white px-8 py-4 rounded-2xl hover:bg-blue-700 transition-all shadow-lg hover:scale-105 active:scale-95"
          >
            Limpiar Filtros y Ver Todo
          </button>
        </motion.div>
      )}
    </div>
  );
}