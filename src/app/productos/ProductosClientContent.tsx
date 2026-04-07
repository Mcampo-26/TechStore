"use client";

import React, { useMemo } from "react";
import { Product } from "@/types";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image"; // Cambiado a Next Image para mejor rendimiento
import { useSearchParams, useRouter } from "next/navigation";
import { SearchInput } from "@/components/layout/SearchInput";
import { ChevronLeft, ArrowUpRight } from "lucide-react";

interface Props {
  initialProducts: Product[];
}

export default function ProductosClientContent({ initialProducts = [] }: Props) {
  const searchParams = useSearchParams();
  const router = useRouter();

  // --- 1. FUENTE DE VERDAD ÚNICA (URL) ---
  const categoriaURL = searchParams.get('categoria') || "Todas";
  const esOferta = searchParams.get('oferta') === "true";
  const query = searchParams.get('q')?.toLowerCase() || "";

  // --- 2. CÁLCULO SINCRÓNICO TOTAL ---
  const { title, filteredProducts } = useMemo(() => {
    const products = initialProducts.filter(product => {
      // 1. Filtro de Ofertas: Si la URL dice oferta=true, solo mostrar productos con isOferta
      if (esOferta && !product.isOferta) return false;

      // 2. Filtro de Categoría: Solo filtrar por categoría si NO estamos en la sección global de Ofertas
      if (categoriaURL !== "Todas" && product.category !== categoriaURL) return false;

      // 3. Filtro de Búsqueda (Lupa): Siempre debe actuar sobre el resultado anterior
      if (query && !product.name.toLowerCase().includes(query)) return false;

      return true;
    });

    const displayTitle = esOferta ? "Ofertas" : (categoriaURL === "Todas" ? "Catálogo" : categoriaURL);

    return { title: displayTitle, filteredProducts: products };
  }, [initialProducts, categoriaURL, esOferta, query]);

  const hayFiltroActivo = categoriaURL !== "Todas" || esOferta || query !== "";

  return (
    <div className="min-h-screen max-w-7xl mx-auto px-4 pt-24 pb-20">

      {/* Botón Volver */}
      <div className="h-10 mb-6">
        <AnimatePresence mode="wait">
          {hayFiltroActivo && (
            <motion.button
              key="btn-back"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              onClick={() => router.push('/productos')}
              className="group flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-blue-600 dark:text-blue-400"
            >
              <div className="p-2 rounded-full border border-blue-600/20 group-hover:bg-blue-600 group-hover:text-white transition-all">
                <ChevronLeft size={14} />
              </div>
              <span>Ver Catálogo Completo</span>
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      <motion.div
        key={title + esOferta}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {/* HEADER */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <motion.h1
              layoutId="main-title"
              className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-[var(--foreground)]"
            >
              {title}
            </motion.h1>
            <p className="text-sm font-bold opacity-40 mt-2 uppercase tracking-widest text-[var(--foreground)]">
              {filteredProducts.length} Productos encontrados
            </p>
          </div>
          <div className="w-full md:w-80">
            <SearchInput />
          </div>
        </header>

        {/* GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8">
          <AnimatePresence mode="popLayout">
            {filteredProducts.map((product) => (
              <motion.div
                layout
                key={product._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="h-full w-full"
              >
                <Link
                  href={`/productos/${product._id}`}
                  style={{ WebkitMaskImage: '-webkit-radial-gradient(white, black)' }}
                  className="group relative flex flex-col h-full bg-[var(--card-bg)] border border-[var(--border-theme)] rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden transition-all duration-700 hover:shadow-2xl hover:-translate-y-1"
                >
                  {/* CONTENEDOR DE IMAGEN */}
                  <div className="relative aspect-square w-full bg-neutral-500/5 dark:bg-white/5 flex items-center justify-center p-8 sm:p-12">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-contain transition-transform duration-700 group-hover:scale-110"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    />
                    
                    {product.isOferta && (
                      <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-10">
                        <span className="inline-flex items-center justify-center backdrop-blur-md bg-blue-600/90 text-white text-[8px] sm:text-[9px] font-black uppercase tracking-[0.2em] px-2.5 py-1.5 rounded-full border border-white/10 shadow-lg shadow-blue-600/20">
                          Oferta
                        </span>
                      </div>
                    )}
                  </div>

                  {/* CONTENIDO */}
                  <div className="p-6 sm:p-8 flex flex-grow flex-col min-w-0">
                    <p className="text-[10px] font-black opacity-30 uppercase mb-1 tracking-widest text-[var(--foreground)]">
                      {product.category}
                    </p>
                    
                    <h3 className="text-lg sm:text-xl font-bold leading-tight group-hover:text-blue-600 transition-colors break-words text-[var(--foreground)]">
                      {product.name}
                    </h3>
                    
                    {/* FOOTER DE CARD */}
                    <div className="mt-auto pt-6 flex justify-between items-end border-t border-[var(--border-theme)]/50">
                      <div className="min-w-0 py-1">
                        <span className="text-[9px] font-bold opacity-30 uppercase block leading-none mb-1 text-[var(--foreground)]">
                          Precio
                        </span>
                        <p className="text-2xl sm:text-3xl font-black italic tracking-tighter leading-none whitespace-nowrap text-[var(--foreground)]">
                          ${Number(product.price).toLocaleString('es-AR')}
                        </p>
                      </div>
                      
                      {/* BOTÓN ICONO */}
                      <div className="flex-shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-[var(--border-theme)] flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all ml-2 text-[var(--foreground)]">
                        <ArrowUpRight size={18} />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* ESTADO VACÍO */}
      {filteredProducts.length === 0 && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="py-20 text-center border-2 border-dashed border-[var(--border-theme)] rounded-[3rem]"
        >
          <h3 className="text-2xl font-black uppercase italic opacity-20 text-[var(--foreground)]">Sin resultados</h3>
          <button 
            onClick={() => router.push('/productos')} 
            className="mt-6 px-8 py-3 bg-blue-600 text-white rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20"
          >
            Limpiar Filtros
          </button>
        </motion.div>
      )}
    </div>
  );
}