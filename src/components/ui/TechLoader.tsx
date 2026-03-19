"use client";

import { motion } from 'framer-motion';
import { ShieldCheck, LogOut } from 'lucide-react';

// AGREGAMOS LA PROPIEDAD AQUÍ PARA QUE TYPESCRIPT LA RECONOZCA
interface TechLoaderProps {
  mode: 'login' | 'logout';
  userName?: string;
  isStepTwo?: boolean; // <-- Esta es la línea que faltaba
}

export const TechLoader = ({ mode, userName, isStepTwo }: TechLoaderProps) => {
  const isLogin = mode === 'login';

  return (
    <motion.div
      key={`tech-loader-${mode}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ 
        opacity: 0, 
        filter: "blur(20px)", 
        scale: 1.1,
        transition: { duration: 0.8, ease: "easeInOut" } 
      }}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center backdrop-blur-xl"
      style={{ backgroundColor: 'var(--background)' }}
    >
      <div className="relative flex items-center justify-center">
        <div className={`w-24 h-24 border-4 rounded-full animate-spin ${
          isLogin ? 'border-blue-600/10 border-t-blue-600' : 'border-red-500/10 border-t-red-500'
        }`} />
        
        <div className="absolute w-16 h-16 border-4 border-white/5 border-b-neutral-400 rounded-full animate-[spin_1.5s_linear_infinite_reverse]" />
        
        <motion.div 
          className={`absolute ${isLogin ? 'text-blue-600' : 'text-red-500'}`}
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          {isLogin ? <ShieldCheck size={32} strokeWidth={2.5} /> : <LogOut size={32} strokeWidth={2.5} />}
        </motion.div>
      </div>

      <div className="mt-10 text-center px-6">
        <h3 className="text-3xl font-black uppercase tracking-tighter italic"
            style={{ color: 'var(--foreground)' }}>
          {isLogin ? (
            isStepTwo ? <>HOLA, <span className="text-blue-600">{userName?.split(' ')[0]}</span></> : 'IDENTIFICANDO...'
          ) : (
            <>CERRANDO <span className="text-red-500">SESIÓN</span></>
          )}
        </h3>
        
        <p className="text-[10px] font-black uppercase tracking-[0.4em] mt-4 opacity-50 max-w-[280px] leading-relaxed"
           style={{ color: 'var(--foreground)' }}>
          {isLogin 
            ? (isStepTwo ? 'Verificando credenciales encriptadas' : 'Sincronizando entorno de trabajo...') 
            : 'Finalizando conexión segura '}
        </p>
      </div>

      <div className="mt-10 w-48 h-1.5 bg-neutral-800/10 dark:bg-white/5 rounded-full overflow-hidden border"
           style={{ borderColor: 'var(--border-theme)' }}>
        <div className={`h-full animate-[progress_2s_ease-in-out_infinite] ${
          isLogin ? 'bg-gradient-to-r from-blue-600 via-emerald-400 to-blue-600' : 'bg-gradient-to-r from-red-600 via-neutral-400 to-red-600'
        }`} />
      </div>

      <style jsx>{`
        @keyframes progress {
          0% { width: 0%; transform: translateX(-100%); }
          50% { width: 70%; transform: translateX(20%); }
          100% { width: 0%; transform: translateX(200%); }
        }
      `}</style>
    </motion.div>
  );
};