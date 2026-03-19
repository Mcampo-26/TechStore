"use client";

import { useEffect, useState } from 'react';
import { LoginForm } from '@/components/auth/LoginForm';
import { useAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
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
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isLoggedIn, router]);

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 transition-colors duration-300" 
         style={{ backgroundColor: 'var(--background)' }}>
      
      <div className="max-w-md mx-auto">
        <AnimatePresence mode="wait">
          {!isLoggedIn && !isTransitioning ? (
            <motion.div
              key="login-ui"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, filter: "blur(15px)", scale: 0.95, transition: { duration: 0.3 } }}
            >
              <div className="flex flex-col items-center mb-8 text-center">
                <div className="bg-blue-600/10 p-4 rounded-[1.5rem] text-blue-600 mb-4 border"
                     style={{ borderColor: 'var(--border-theme)' }}>
                  <Laptop size={32} />
                </div>
                <span className="bg-blue-600/10 text-blue-600 text-[10px] font-black px-2 py-1 rounded-lg uppercase tracking-widest mb-2">
                  Acceso Clientes
                </span>
                <h1 className="text-3xl font-black leading-tight tracking-tighter uppercase" 
                    style={{ color: 'var(--foreground)' }}>
                  HOLA DE NUEVO
                </h1>
                <p className="text-xs font-bold opacity-50 mt-1 uppercase tracking-wider" 
                   style={{ color: 'var(--foreground)' }}>
                  Tu setup tech te está esperando.
                </p>
              </div>

              <LoginForm 
                onStartLoading={() => setIsTransitioning(true)} 
                onLoginError={() => setIsTransitioning(false)} 
              />

              <p className="mt-8 text-center text-[10px] font-black uppercase tracking-widest opacity-60" 
                 style={{ color: 'var(--foreground)' }}>
                ¿No tienes cuenta?{' '}
                <a href="/register" className="text-blue-600 font-black hover:underline transition-colors">
                  Crea una ahora
                </a>
              </p>
            </motion.div>
          ) : (
            /* Usamos el componente reutilizable en modo login */
            <TechLoader 
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