"use client";

import React, { useEffect } from "react";
import { useProductStore } from "@/store/useProductStore";
import { Product } from "@/types";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link"; // <--- IMPORTANTE: Para la navegación al detalle

interface ProductosClientContentProps {
  initialProducts: Product[];
  activeCategory: string;
}

export default function ProductosClientContent({ 
  initialProducts = [], 
  activeCategory 
}: ProductosClientContentProps) {
  
  const { setProducts } = useProductStore();

  useEffect(() => {
    if (initialProducts) {
      setProducts(initialProducts);
    }
  }, [initialProducts, setProducts]);

  if (!initialProducts) return null;

  return (
    <div className="min-h-screen pt-20">
       <h1 className="text-4xl font-black mb-8 uppercase px-10 tracking-tighter" style={{ color: 'var(--foreground)' }}>
         {activeCategory}
       </h1>
       
       <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 px-10 pb-20">
         <AnimatePresence mode="popLayout">
           {initialProducts.map((product) => {
             // Definimos el ID correctamente (soporta MongoDB _id o id plano)
             const productId = product._id || (product as any).id;

             return (
               <motion.div 
                 key={productId}
                 layout // <--- Layout permite que las cards se reacomoden suavemente al filtrar
                 initial={{ opacity: 0, scale: 0.9 }}
                 animate={{ opacity: 1, scale: 1 }}
                 exit={{ opacity: 0, scale: 0.9 }}
                 transition={{ duration: 0.2 }}
               >
                 {/* EL LINK ES LO QUE PERMITE IR AL DETALLE */}
                 <Link 
                   href={`/productos/${productId}`} 
                   className="group block p-4 border rounded-[2rem] transition-all hover:shadow-2xl hover:-translate-y-2 flex flex-col h-full"
                   style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-theme)' }}
                 >
                   <div className="relative w-full h-48 mb-4 bg-white rounded-2xl overflow-hidden p-4">
                     <img 
                       src={product.image} 
                       alt={product.name} 
                       className="w-full h-full object-contain transition-transform group-hover:scale-110" 
                     />
                     {product.isOferta && (
                       <span className="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase">
                         Oferta
                       </span>
                     )}
                   </div>

                   <h3 className="font-bold text-lg line-clamp-2 flex-grow" style={{ color: 'var(--foreground)' }}>
                     {product.name}
                   </h3>

                   <div className="mt-4 flex items-center justify-between">
                     <p className="text-2xl font-black text-blue-600">
                       ${Number(product.price).toLocaleString('es-AR')}
                     </p>
                     <span className="text-[10px] font-black uppercase opacity-40 group-hover:opacity-100 transition-opacity" style={{ color: 'var(--foreground)' }}>
                       Ver Detalle →
                     </span>
                   </div>
                 </Link>
               </motion.div>
             );
           })}
         </AnimatePresence>
       </div>

       {/* Mensaje de feedback si la categoría está vacía */}
       {initialProducts.length === 0 && (
         <div className="flex flex-col items-center justify-center py-20 opacity-30">
           <p className="font-black uppercase tracking-[0.3em]">No hay productos</p>
         </div>
       )}
    </div>
  );
}