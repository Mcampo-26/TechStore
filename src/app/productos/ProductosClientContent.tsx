"use client";

import React, { useEffect, useMemo } from "react";
import { useProductStore } from "@/store/useProductStore";
import { Product } from "@/types";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { SearchInput } from "@/components/layout/SearchInput";
import { ChevronLeft, ArrowUpRight } from "lucide-react";

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

  const hayFiltroActivo = !!categoriaURL || esOferta || searchQuery !== "";

  // EFECTO PARA RESETEAR SCROLL Y CARGAR PRODUCTOS
  useEffect(() => {
    // Forzamos el scroll al inicio cada vez que cambien los filtros o la carga inicial
    window.scrollTo(0, 0);

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

  const volverAlCatalogo = () => {
    setSearchQuery("");
    router.push('/productos');
  };

  return (
    <div className="min-h-screen max-w-7xl mx-auto px-4 pt-24 pb-20">

      {/* Botón Volver */}
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
          {productsToDisplay.map((product, index) => {
            const id = product._id || (product as any).id;
            return (
              <motion.div
                key={id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ 
                  duration: 0.5, 
                  ease: [0.22, 1, 0.36, 1],
                  delay: index * 0.02 
                }}
              >
                <Link
                  href={`/productos/${id}`}
                  className="group relative flex flex-col h-full bg-[var(--card-bg)] border border-[var(--border-theme)] rounded-[2.5rem] overflow-hidden transition-all duration-700 hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.6)]"
                >
                  <div className="relative aspect-square w-full bg-neutral-500/5 dark:bg-white/5 flex items-center justify-center p-12 transition-colors duration-500 group-hover:bg-transparent">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-contain transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:scale-110 group-hover:-translate-y-4 drop-shadow-xl"
                    />
                    
                    {product.isOferta && (
                      <div className="absolute top-8 left-8">
                        <span className="backdrop-blur-md bg-blue-600/90 text-white text-[9px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-full shadow-lg border border-white/10">
                          Oferta Especial
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="p-8 flex flex-col flex-grow">
                    <div className="space-y-1 mb-6">
                      <p className="text-[10px] font-black opacity-30 uppercase tracking-[0.2em] text-[var(--foreground)]">
                        {product.category || "Edición Limitada"}
                      </p>
                      <h3 className="text-xl font-bold tracking-tight text-[var(--foreground)] leading-[1.2] transition-colors duration-300 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                        {product.name}
                      </h3>
                    </div>

                    <div className="mt-auto flex items-end justify-between pt-6 border-t border-[var(--border-theme)]/50">
                      <div className="flex flex-col">
                        <span className="text-[9px] font-bold opacity-30 uppercase tracking-tighter text-[var(--foreground)]">Precio Final</span>
                        <p className="text-3xl font-black text-[var(--foreground)] tracking-tighter">
                          <span className="text-blue-600 dark:text-blue-400 text-lg mr-0.5">$</span>
                          {Number(product.price).toLocaleString('es-AR')}
                        </p>
                      </div>

                      <div className="w-12 h-12 rounded-full border border-[var(--border-theme)] flex items-center justify-center text-[var(--foreground)] transition-all duration-500 group-hover:bg-blue-600 group-hover:border-blue-600 group-hover:text-white group-hover:rotate-45">
                        <ArrowUpRight size={22} />
                      </div>
                    </div>
                  </div>

                  <div className="absolute -inset-24 bg-blue-500/10 blur-[100px] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                </Link>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Estado vacío */}
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