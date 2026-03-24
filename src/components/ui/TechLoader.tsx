"use client";

import { motion } from 'framer-motion';
import { ShieldCheck, LogOut } from 'lucide-react';

interface TechLoaderProps {
  mode: 'login' | 'logout';
  userName?: string;
  isStepTwo?: boolean;
}

export const TechLoader = ({ mode, userName, isStepTwo }: TechLoaderProps) => {
  const isLogin = mode === 'login';

  return (
    <motion.div
      key={`tech-loader-${mode}`}
      initial={{ 
        opacity: 0, 
        filter: "blur(15px)", 
        scale: 1.05 // Empieza un poco más grande para fundirse con la salida del login
      }}
      animate={{ 
        opacity: 1, 
        filter: "blur(0px)", 
        scale: 1,
        transition: { 
          duration: 0.6, 
          ease: [0.22, 1, 0.36, 1] 
        } 
      }}
      exit={{ 
        opacity: 0, 
        filter: "blur(20px)", 
        scale: 1.1,
        transition: { duration: 0.7, ease: "easeInOut" } 
      }}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center backdrop-blur-xl"
      style={{ backgroundColor: 'var(--background)' }}
    >
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="relative flex items-center justify-center"
      >
        <div className={`w-24 h-24 border-4 rounded-full animate-spin ${
          isLogin ? 'border-blue-600/10 border-t-blue-600' : 'border-red-500/10 border-t-red-500'
        }`} />
        
        <div className="absolute w-16 h-16 border-4 border-white/5 border-b-neutral-400 rounded-full animate-[spin_1.5s_linear_infinite_reverse]" />
        
        <motion.div 
          className={`absolute ${isLogin ? 'text-blue-600' : 'text-red-500'}`}
          animate={{ scale: [1, 1.15, 1], opacity: [0.7, 1, 0.7] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          {isLogin ? <ShieldCheck size={32} strokeWidth={2.5} /> : <LogOut size={32} strokeWidth={2.5} />}
        </motion.div>
      </motion.div>

      <motion.div 
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className="mt-10 text-center px-6"
      >
        <h3 className="text-3xl font-black uppercase tracking-tighter italic"
            style={{ color: 'var(--foreground)' }}>
          {isLogin ? (
            isStepTwo ? <>HOLA, <span className="text-blue-600">{userName?.split(' ')[0]}</span></> : 'IDENTIFICANDO...'
          ) : (
            <>CERRANDO <span className="text-red-500">SESIÓN</span></>
          )}
        </h3>
        
        <p 
  className="text-[10px] font-black uppercase tracking-[0.4em] mt-4 opacity-50 max-w-[280px] leading-relaxed mx-auto italic animate-pulse"
  style={{ color: 'var(--foreground)' }}
>
  {isLogin 
    ? 'Verificando credenciales encriptadas' 
    : 'Finalizando conexión segura'}
</p>
      </motion.div>

      <motion.div 
        initial={{ width: 0, opacity: 0 }}
        animate={{ width: 192, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="mt-10 h-1.5 bg-neutral-800/10 dark:bg-white/5 rounded-full overflow-hidden border mx-auto"
        style={{ borderColor: 'var(--border-theme)' }}
      >
        <div className={`h-full animate-[progress_2s_ease-in-out_infinite] ${
          isLogin ? 'bg-gradient-to-r from-blue-600 via-emerald-400 to-blue-600' : 'bg-gradient-to-r from-red-600 via-neutral-400 to-red-600'
        }`} />
      </motion.div>

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