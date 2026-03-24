"use client";

import React, { useMemo } from "react";
import { Product } from "@/types";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
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
  // Calculamos título y productos JUNTOS en el mismo ciclo de render
  const { title, filteredProducts } = useMemo(() => {
    const products = initialProducts.filter(product => {
      if (esOferta && !product.isOferta) return false;
      if (categoriaURL !== "Todas" && !esOferta && product.category !== categoriaURL) return false;
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
      <div className="h-10 mb-2">
        <AnimatePresence>
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

      {/* Contenedor Principal Animado por KEY */}
      {/* El uso de key={title} asegura que cuando cambies de categoría en el Navbar, 
          toda la sección se trate como una transición nueva y coordinada */}
      <motion.div
        key={title + esOferta}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <motion.h1
              layoutId="main-title"
              className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-[var(--foreground)]"
            >
              {title}
            </motion.h1>
            <p className="text-sm font-bold opacity-40 mt-2 uppercase tracking-widest">
              {filteredProducts.length} Productos encontrados
            </p>
          </div>
          <div className="w-full md:w-80">
            <SearchInput />
          </div>
        </div>

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
          style={{ WebkitMaskImage: '-webkit-radial-gradient(white, black)' }} // Truco para Safari iOS
          className="group relative flex flex-col h-full bg-[var(--card-bg)] border border-[var(--border-theme)] rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden transition-all duration-700 hover:shadow-2xl"
        >
          {/* CONTENEDOR DE IMAGEN: Reducido padding en móvil (p-8) */}
          <div className="relative aspect-square w-full bg-neutral-500/5 dark:bg-white/5 flex items-center justify-center p-8 sm:p-12">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-110"
            />
            
            {/* ETIQUETA OFERTA: Posición corregida para que no flote en el medio */}
            {product.isOferta && (
              <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-10">
                <span className="inline-flex items-center justify-center backdrop-blur-md bg-blue-600/90 text-white text-[8px] sm:text-[9px] font-black uppercase tracking-[0.2em] px-2.5 py-1.5 rounded-full border border-white/10 shadow-lg shadow-blue-600/20">
                  Oferta
                </span>
              </div>
            )}
          </div>

          {/* CONTENIDO: p-6 en móvil para ganar espacio */}
          <div className="p-6 sm:p-8 flex flex-grow flex-col min-w-0">
            <p className="text-[10px] font-black opacity-30 uppercase mb-1 tracking-widest">
              {product.category}
            </p>
            
            {/* TÍTULO: text-lg en móvil + break-words para evitar cortes */}
            <h3 className="text-lg sm:text-xl font-bold leading-tight group-hover:text-blue-600 transition-colors break-words">
              {product.name}
            </h3>
            
            {/* FOOTER DE CARD */}
            <div className="mt-auto pt-6 flex justify-between items-end border-t border-[var(--border-theme)]/50">
              <div className="min-w-0">
                <span className="text-[9px] font-bold opacity-30 uppercase block">Precio</span>
                <p className="text-2xl sm:text-3xl font-black italic tracking-tighter truncate">
                  ${Number(product.price).toLocaleString('es-AR')}
                </p>
              </div>
              
              {/* BOTÓN ICONO: Más pequeño en móvil */}
              <div className="flex-shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-[var(--border-theme)] flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all ml-2">
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
        <div className="py-20 text-center border-2 border-dashed border-[var(--border-theme)] rounded-[3rem]">
          <h3 className="text-2xl font-black uppercase italic">Sin resultados</h3>
          <button onClick={() => router.push('/productos')} className="mt-6 px-8 py-3 bg-blue-600 text-white rounded-xl font-black uppercase text-[10px] tracking-widest">
            Limpiar Filtros
          </button>
        </div>
      )}
    </div>
  );
}