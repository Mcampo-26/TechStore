"use client";

import { useEffect, useState } from 'react';
import { LoginForm } from '@/components/auth/LoginForm';
import { Laptop, CheckCircle2, Sparkles, ShieldCheck, Loader2 } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

export default function LoginPage() {
  const { isLoggedIn, user } = useAuthStore();
  const router = useRouter();
  
  const [isDone, setIsDone] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    if (isLoggedIn) {
      setIsDone(true);
      
      const welcomeTimer = setTimeout(() => {
        setShowWelcome(true);
      }, 800);

      const redirectTimer = setTimeout(() => {
        router.push('/');
      }, 4000);
      
      return () => {
        clearTimeout(welcomeTimer);
        clearTimeout(redirectTimer);
      };
    }
  }, [isLoggedIn, router]);

  return (
    <div className={`min-h-screen pt-32 pb-20 px-6 transition-colors duration-1000 flex flex-col items-center
      ${showWelcome ? 'bg-[#0f172a]' : 'bg-[var(--background)]'}`}>
      
      <div className="max-w-md w-full relative min-h-[500px] flex flex-col justify-center">
        
        <AnimatePresence mode="wait">
          {!showWelcome ? (
            /* CONTENEDOR LOGIN */
            <motion.div
              key="login-form"
              initial={{ opacity: 0, y: 20 }}
              animate={isDone ? { opacity: 0, scale: 0.95, filter: 'blur(10px)' } : { opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
            >
              <div className="flex flex-col items-center mb-10 text-center">
                <div className="bg-blue-600 text-white p-5 rounded-[2rem] mb-6 shadow-2xl shadow-blue-600/30">
                  <Laptop size={36} />
                </div>
                
                <div className="bg-blue-600/10 text-blue-600 text-[10px] font-black px-4 py-2 rounded-full uppercase tracking-widest mb-6 border border-blue-600/20">
                  Identificación Requerida
                </div>

                <h1 className="text-4xl font-black leading-tight tracking-tighter uppercase mb-2 text-[var(--foreground)]">
                  LOGIN <span className="text-blue-600">CLIENTES</span>
                </h1>
                <p className="text-[11px] font-bold opacity-40 uppercase tracking-[0.3em] text-[var(--foreground)]">
                  Ingresa a tu cuenta oficial
                </p>
              </div>

              <LoginForm />

              <p className="mt-10 text-center text-[10px] font-black uppercase tracking-widest opacity-30 text-[var(--foreground)]">
                ¿No tienes cuenta?{' '}
                <a href="/register" className="text-blue-600 hover:text-blue-500 transition-colors">
                  Regístrate ahora
                </a>
              </p>
            </motion.div>
          ) : (
            /* CONTENEDOR BIENVENIDA (Framer Motion) */
            <motion.div
              key="welcome-screen"
              initial={{ opacity: 0, scale: 0.8, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ 
                type: "spring",
                stiffness: 100,
                damping: 20,
                duration: 0.8 
              }}
              className="flex flex-col items-center text-center"
            >
              <div className="relative flex items-center justify-center mb-12">
                {/* Spinner Pro con Framer Motion */}
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                  className="absolute h-40 w-40 rounded-full border-t-4 border-l-2 border-blue-500/30 shadow-[0_0_40px_rgba(37,99,235,0.2)]"
                />
                
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3, type: "spring" }}
                  className="relative bg-blue-600 text-white p-8 rounded-[2.5rem] shadow-[0_20px_50px_rgba(37,99,235,0.5)]"
                >
                  <ShieldCheck size={56} strokeWidth={2.5} />
                </motion.div>

                <motion.div
                  animate={{ opacity: [0, 1, 0], scale: [0.5, 1.2, 0.5] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="absolute -top-8 -right-8 text-amber-400"
                >
                  <Sparkles size={40} />
                </motion.div>
              </div>

              <div className="space-y-6">
                <motion.h2 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="text-6xl font-black uppercase tracking-tighter text-white"
                >
                  HOLA, <span className="text-blue-500">{user?.name?.split(' ')[0] || 'ADMIN'}</span>
                </motion.h2>
                
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ delay: 0.7, duration: 1 }}
                  className="flex items-center justify-center gap-4"
                >
                  <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-blue-500/50" />
                  <p className="text-[14px] font-black uppercase tracking-[0.6em] text-blue-400 whitespace-nowrap">
                    Acceso Autorizado
                  </p>
                  <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-blue-500/50" />
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.2 }}
                  className="pt-10 flex flex-col items-center gap-4"
                >
                  <div className="flex gap-2">
                    {[0, 1, 2].map((i) => (
                      <motion.span
                        key={i}
                        animate={{ y: [0, -10, 0] }}
                        transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.1 }}
                        className="w-3 h-3 bg-blue-600 rounded-full"
                      />
                    ))}
                  </div>
                  <span className="text-[10px] font-black uppercase opacity-40 tracking-[0.3em] text-white">
                    Sincronizando base de datos...
                  </span>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}