"use client";

import React from 'react';

const BRANDS = [
  { name: 'Kingston', logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQGZkm55tCs_T1-CkPUThyxsSf__RICuw-44A&s' },
  { name: 'Lenovo', logo: 'https://cdn.vectorstock.com/i/1000v/53/57/lenovo-logo-brand-phone-symbol-red-design-vector-46215357.jpg' },
  { name: 'Liliana', logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRYTRfU4sDtkV6wYQ4F-tItaZB6Y6QMW9qGf5Kc28XP&s' },
  { name: 'Logitech', logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRS135osj2fY7fR0Fnu0LxtD1gUC9zax5PN0g&s' },
  { name: 'Netmak', logo: 'https://scontent.ftuc1-1.fna.fbcdn.net/v/t39.30808-6/277571171_382412663890481_2938011832301338181_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=1d70fc&_nc_eui2=AeGJWu1evzfXoXueY9UwkNmlWMhIDIvCXY1YyEgMi8Jdjf7gvTBOiX6ghkpDNZTyRsy_Rraw9Pd7UqrQhJ6gUN9G&_nc_ohc=-jAk7E27YwoQ7kNvwFCCAR0&_nc_oc=AdmU0-Tu92du1tvc9LWVY7TASODfD-NjBhVLUOeni58s0JG4OLNrgn2Gbw7r10ejkNY&_nc_zt=23&_nc_ht=scontent.ftuc1-1.fna&_nc_gid=YKw_w9DRry4RmP7bG8l-KQ&_nc_ss=8&oh=00_AfzZISP8InWNs5jDqEE_awAte1XzmgCX8gt0yflvbkm3UA&oe=69B78DFE' },
  { name: 'Samsung', logo: 'https://images.samsung.com/is/image/samsung/assets/global/about-us/brand/logo/mo/360_197_1.png?$720_N_PNG$' }
];

export const BrandBanner = () => {
  return (
    <section className="py-16 border-b overflow-hidden relative" style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border-theme)' }}>
      
      {/* Título Estilo Tech */}
      <div className="max-w-7xl mx-auto px-6 mb-12">
        <div className="flex items-center gap-4 opacity-40">
          <div className="h-[1px] flex-1 bg-current" />
          <p className="text-[10px] font-black tracking-[0.4em] uppercase whitespace-nowrap" style={{ color: 'var(--foreground)' }}>
            Partners Tecnológicos
          </p>
          <div className="h-[1px] flex-1 bg-current" />
        </div>
      </div>

      {/* Slider Contenedor */}
      <div className="relative flex items-center">
        {/* Overlays de desvanecimiento laterales dinámicos */}
        <div className="absolute left-0 w-32 h-full z-10 pointer-events-none" 
             style={{ background: 'linear-gradient(to right, var(--background), transparent)' }} />
        <div className="absolute right-0 w-32 h-full z-10 pointer-events-none" 
             style={{ background: 'linear-gradient(to left, var(--background), transparent)' }} />

        <div className="flex animate-marquee hover:pause-marquee whitespace-nowrap gap-20 items-center">
          {/* Triplicamos para asegurar que no haya saltos visuales en pantallas anchas */}
          {[...BRANDS, ...BRANDS, ...BRANDS].map((brand, index) => (
            <div 
              key={index} 
              className="group flex flex-col items-center justify-center min-w-[140px]"
            >
              <div className="h-12 flex items-center justify-center">
                <img 
                  src={brand.logo} 
                  alt={brand.name} 
                  className="h-full w-auto object-contain grayscale invert-0 dark:invert-[0.8] opacity-40 group-hover:grayscale-0 group-hover:invert-0 group-hover:opacity-100 transition-all duration-500 cursor-pointer scale-90 group-hover:scale-110"
                />
              </div>
              
              {/* Etiqueta flotante sutil */}
              <span className="mt-4 text-[8px] font-black text-blue-600 opacity-0 group-hover:opacity-100 transition-all uppercase tracking-[0.2em] translate-y-2 group-hover:translate-y-0">
                {brand.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.33%); }
        }
        .animate-marquee {
          display: flex;
          animation: marquee 40s linear infinite;
        }
        .pause-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
};