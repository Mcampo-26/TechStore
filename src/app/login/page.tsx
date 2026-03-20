"use client";

import { useEffect, useState } from 'react';
import { LoginForm } from '@/components/auth/LoginForm';
import { useAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { Laptop } from 'lucide-react';
import { TechLoader } from '@/components/ui/TechLoader';

export default function LoginPage() {
  const { isLoggedIn, user } = useAuthStore();
  const router = useRouter();
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    if (isLoggedIn) {
      const timer = setTimeout(() => {
        router.push('/');
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [isLoggedIn, router]);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08, 
        delayChildren: 0.1,
        ease: [0.22, 1, 0.36, 1]
      }
    },
    exit: {
      opacity: 0,
      filter: "blur(15px)",
      scale: 0.98,
      transition: { duration: 0.4, ease: "easeOut" }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 15, scale: 0.98 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-20 px-6" style={{ backgroundColor: 'var(--background)' }}>
      <div className="max-w-md mx-auto">
        {/* 'popLayout' evita el hueco blanco entre componentes */}
        <AnimatePresence mode="popLayout">
          {!isLoggedIn && !isTransitioning ? (
            <motion.div
              key="login-ui"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="w-full"
            >
              <motion.div variants={itemVariants} className="flex flex-col items-center mb-8 text-center">
                <div className="bg-blue-600/10 p-4 rounded-[1.5rem] text-blue-600 mb-4 border"
                     style={{ borderColor: 'var(--border-theme)' }}>
                  <Laptop size={32} />
                </div>
                
                <motion.span variants={itemVariants} className="bg-blue-600/10 text-blue-600 text-[10px] font-black px-2 py-1 rounded-lg uppercase tracking-widest mb-2">
                  Acceso Clientes
                </motion.span>
                
                <motion.h1 variants={itemVariants} className="text-3xl font-black leading-tight tracking-tighter uppercase" 
                    style={{ color: 'var(--foreground)' }}>
                  HOLA DE NUEVO
                </motion.h1>
                
                <motion.p variants={itemVariants} className="text-xs font-bold opacity-50 mt-1 uppercase tracking-wider" 
                   style={{ color: 'var(--foreground)' }}>
                  Tu setup tech te está esperando.
                </motion.p>
              </motion.div>

              <motion.div variants={itemVariants}>
                <LoginForm 
                  onStartLoading={() => setIsTransitioning(true)} 
                  onLoginError={() => setIsTransitioning(false)} 
                />
              </motion.div>

              <motion.p variants={itemVariants} className="mt-8 text-center text-[10px] font-black uppercase tracking-widest opacity-60" 
                  style={{ color: 'var(--foreground)' }}>
                ¿No tienes cuenta?{' '}
                <a href="/register" className="text-blue-600 font-black hover:underline transition-colors">
                  Crea una ahora
                </a>
              </motion.p>
            </motion.div>
          ) : (
            <TechLoader 
              key="loader"
              mode="login" 
              userName={user?.name} 
              isStepTwo={isLoggedIn} 
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}