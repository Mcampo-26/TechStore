"use client";

import React, { useEffect, useState } from 'react';
import { motion, Variants } from 'framer-motion'; 
import { Truck, ShieldCheck, CreditCard, Clock } from 'lucide-react';
import { ProductCard } from '@/components/products/ProductCard';
import { Product } from '@/types';
import { BrandBanner } from '@/components/Home/BrandBanner';
import { PromoBanner } from '@/components/Home/PromoBanner';
import { useProductStore } from '@/store/useProductStore';
import { SearchInput } from '@/components/layout/SearchInput';

interface Props {
  initialProducts: Product[];
}

export default function HomeClient({ initialProducts }: Props) {
  const { filteredProducts, setProducts, searchQuery } = useProductStore();
  const [shouldAnimate, setShouldAnimate] = useState(false);

  useEffect(() => {
    if (initialProducts) {
      setProducts(initialProducts);
    }
    
    // ELIMINADO: setTimeout. 
    // Al setearlo directamente, React espera al siguiente 'tick' del navegador.
    setShouldAnimate(true);
    
  }, [initialProducts, setProducts]);

  const displayProducts = (filteredProducts.length === 0 && searchQuery === "") 
    ? initialProducts 
    : filteredProducts;

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.2 }
    }
  };

  const itemVariants: Variants = {
    hidden: { 
      opacity: 0, 
      y: 8, // CAMBIO: Menos distancia = entrada más suave
      filter: "blur(8px)", 
    },
    visible: { 
      opacity: 1, 
      y: 0, 
      filter: "blur(0px)",
      transition: { 
        duration: 1, // Duración perfecta para elegancia
        ease: [0.22, 1, 0.36, 1], 
      }
    }
  };

  return (
    <div 
      className={`transition-opacity duration-500 ${shouldAnimate ? 'opacity-100' : 'opacity-0'}`}
      style={{ backgroundColor: 'var(--background)' }}
    >
      <motion.div 
        initial="hidden"
        animate={shouldAnimate ? "visible" : "hidden"}
        variants={containerVariants}
      >
        <motion.div 
  variants={itemVariants}
  style={{ 
    willChange: "transform, opacity", // Prepara la tarjeta de video
    backfaceVisibility: "hidden",     // Evita parpadeos en Chrome
    transform: "translateZ(0)"        // Fuerza aceleración 3D
  }}
>
  <PromoBanner />
</motion.div>

        {/* ... Resto de secciones (Beneficios, Productos, etc.) con variants={itemVariants} ... */}
        
        <motion.div 
          variants={itemVariants}
          className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-8"
        >
          {/* Mismo mapeo de beneficios que ya tienes */}
          {[
            { icon: <Truck />, title: "Envío Gratis", desc: "En compras mayores a $50k" },
            { icon: <ShieldCheck />, title: "Compra Segura", desc: "Garantía oficial tech" },
            { icon: <CreditCard />, title: "Cuotas Sin Interés", desc: "Con todos los bancos" },
            { icon: <Clock />, title: "Soporte 24/7", desc: "Expertos online" },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-4 group">
              <div className="p-3 bg-blue-500/10 text-blue-600 rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                {item.icon}
              </div>
              <div>
                <h4 className="font-bold text-xs md:text-sm" style={{ color: 'var(--foreground)' }}>{item.title}</h4>
                <p className="text-[10px] md:text-xs opacity-50" style={{ color: 'var(--foreground)' }}>{item.desc}</p>
              </div>
            </div>
          ))}
        </motion.div>

        <section className="max-w-7xl mx-auto px-4 py-8">
          <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
            <h2 className="text-3xl font-black tracking-tighter border-l-8 border-blue-600 pl-4" style={{ color: 'var(--foreground)' }}>
              PRODUCTOS <span className="text-blue-600">DESTACADOS</span>
            </h2>
            <div className="w-full md:w-80"><SearchInput /></div>
          </motion.div>

          <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {displayProducts.map((product) => (
              <ProductCard key={product.id || (product as any)._id} product={product} />
            ))}
          </motion.div>
        </section>

        <motion.div variants={itemVariants} className="border-t transition-colors mt-20" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-theme)' }}>
          <BrandBanner />
        </motion.div>
      </motion.div>
    </div>
  );
}