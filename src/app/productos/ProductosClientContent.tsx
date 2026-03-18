"use client";

import React, { useEffect } from "react";
import { useProductStore } from "@/store/useProductStore";
import { Product } from "@/types";
import { motion, AnimatePresence } from "framer-motion";

interface ProductosClientContentProps {
  initialProducts: Product[];
  activeCategory: string;
}

// ASEGÚRATE DE QUE EL NOMBRE SEA ESTE Y NO AdminClientContent
export default function ProductosClientContent({ 
  initialProducts = [], // Valor por defecto para evitar el error .length
  activeCategory 
}: ProductosClientContentProps) {
  
  const { setProducts } = useProductStore();

  useEffect(() => {
    if (initialProducts) {
      setProducts(initialProducts);
    }
  }, [initialProducts, setProducts]);

  // Si no hay productos, mostramos un mensaje en lugar de romper la app
  if (!initialProducts) return null;

  return (
    <div className="min-h-screen pt-20">
       <h1 className="text-4xl font-bold mb-8 uppercase px-10">
         {activeCategory}
       </h1>
       
       <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 px-10">
         <AnimatePresence>
           {initialProducts.map((product) => (
             <motion.div 
               key={product._id}
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               className="p-4 border rounded-2xl bg-[var(--card-bg)]"
             >
               <img src={product.image} alt={product.name} className="w-full h-48 object-contain" />
               <h3 className="font-bold mt-2">{product.name}</h3>
               <p className="text-blue-600 font-black">${product.price}</p>
             </motion.div>
           ))}
         </AnimatePresence>
       </div>
    </div>
  );
}