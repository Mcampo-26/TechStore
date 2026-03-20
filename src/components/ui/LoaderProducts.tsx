"use client";

import { motion } from 'framer-motion';

interface LoaderProductsProps {
  productName?: string;
}

export const LoaderProducts = ({ productName }: LoaderProductsProps) => {
  return (
    <motion.div
      key="loader-products"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      // La clave: Sin fondo sólido, solo el blur que "atrapa" lo que hay detrás
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center backdrop-blur-[8px] bg-white/5 dark:bg-black/5"
    >
      <div className="relative flex flex-col items-center">
        {/* Anillo de carga muy fino y elegante */}
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="w-10 h-10 border-t-2 border-blue-600 dark:border-blue-400 rounded-full mb-4 shadow-[0_0_15px_rgba(37,99,235,0.3)]"
        />
        
        <div className="text-center">
          <motion.span 
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="text-[10px] font-black uppercase tracking-[0.6em] text-blue-600 dark:text-blue-400 ml-[0.6em]"
          >
            Sincronizando
          </motion.span>
          
          {productName && (
            <p className="text-[9px] font-bold uppercase tracking-widest opacity-30 mt-1"
               style={{ color: 'var(--foreground)' }}>
              {productName}
            </p>
          )}
        </div>
      </div>

      {/* Gradiente radial sutil para centrar la atención sin tapar el diseño */}
      <div className="absolute inset-0 bg-radial-gradient from-transparent to-white/10 dark:to-black/20 pointer-events-none" />
    </motion.div>
  );
};