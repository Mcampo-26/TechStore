"use client";

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const BRANDS = [
  { name: 'Kingston', logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQGZkm55tCs_T1-CkPUThyxsSf__RICuw-44A&s' },
  { name: 'Lenovo', logo: 'https://cdn.vectorstock.com/i/1000v/53/57/lenovo-logo-brand-phone-symbol-red-design-vector-46215357.jpg' },
  { name: 'Liliana', logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRYTRfU4sDtkV6wYQ4F-tItaZB6Y6QMW9qGf5Kc28XP&s' },
  { name: 'Logitech', logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRS135osj2fY7fR0Fnu0LxtD1gUC9zax5PN0g&s' },
  { name: 'Netmak', logo: 'https://scontent.ftuc1-1.fna.fbcdn.net/v/t39.30808-6/277571171_382412663890481_2938011832301338181_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=1d70fc&oh=00_AfzZISP8InWNs5jDqEE_awAte1XzmgCX8gt0yflvbkm3UA&oe=69B78DFE' },
  { name: 'Samsung', logo: 'https://images.samsung.com/is/image/samsung/assets/global/about-us/brand/logo/mo/360_197_1.png?$720_N_PNG$' }
];

export const BrandBanner = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="h-24" />;

  const duplicatedBrands = [...BRANDS, ...BRANDS, ...BRANDS, ...BRANDS];

  return (
    <section className="py-12 overflow-hidden relative border-y border-[var(--border-theme)] bg-transparent">
      
      <div className="relative flex items-center">
        {/* Degradados laterales para suavizar los bordes */}
        <div className="absolute left-0 w-40 h-full z-10 pointer-events-none bg-gradient-to-r from-[var(--background)] to-transparent" />
        <div className="absolute right-0 w-40 h-full z-10 pointer-events-none bg-gradient-to-l from-[var(--background)] to-transparent" />

        <motion.div 
          className="flex gap-28 items-center whitespace-nowrap"
          animate={{ x: [0, -1800] }} 
          transition={{ 
            duration: 40, 
            repeat: Infinity, 
            ease: "linear" 
          }}
        >
          {duplicatedBrands.map((brand, index) => (
            <div 
              key={`${brand.name}-${index}`} 
              className="group flex flex-col items-center justify-center transition-all duration-500 hover:scale-110"
            >
              {/* TRUCO: mix-blend-mode elimina el fondo blanco/gris del JPG */}
              <div className="h-10 flex items-center justify-center">
                <img 
                  src={brand.logo} 
                  alt={brand.name}
                  className={`
                    h-8 w-auto object-contain transition-all duration-500
                    grayscale opacity-50 group-hover:opacity-100 group-hover:grayscale-0
                    /* Este modo de mezcla hace que el fondo claro desaparezca sobre fondos oscuros */
                    mix-blend-lighten 
                    dark:brightness-125 dark:contrast-125
                  `}
                />
              </div>
              
              <span className="mt-4 text-[7px] font-black text-blue-600 opacity-0 group-hover:opacity-100 transition-all uppercase tracking-[0.4em]">
                {brand.name}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};