"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, LoginInput } from '@/lib/zod';
import { useAuthStore } from '@/store/useAuthStore';
import { useCartStore } from '@/store/useCartStore'; 
import { useState } from 'react';
import { Loader2, Mail, Lock, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { LoadingOverlay } from "@/components/ui/LoadingOverlay";

export const LoginForm = () => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const setLogin = useAuthStore((state) => state.setLogin);
  const setCart = useCartStore((state) => state.setCart); 
  const router = useRouter();

  const { register, handleSubmit, formState: { errors } } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema)
  });

  const onSubmit = async (data: LoginInput) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || 'Error al conectar');

      setLogin(result.user); 

      if (result.user.cart && result.user.cart.length > 0) {
        setCart(result.user.cart);
      }

      router.push('/');      
      router.refresh();      
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && <LoadingOverlay message="Iniciando sesión..." />}
      
      <div className="rounded-[2.5rem] p-10 border shadow-sm transition-all"
           style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-theme)' }}>
        
        {/* ENCABEZADO ESTILO PRODUCTO */}
        <div className="flex flex-col items-center mb-8">
           <div className="bg-blue-600/10 p-3 rounded-2xl text-blue-600 mb-4">
              <ShieldCheck size={24} />
           </div>
           <h2 className="text-xl font-black uppercase tracking-widest text-center" 
               style={{ color: 'var(--foreground)' }}>
             Acceso de Usuario
           </h2>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-2xl text-[10px] font-black uppercase tracking-widest text-center">
              {error}
            </div>
          )}
          
          {/* INPUT EMAIL */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 ml-2"
                   style={{ color: 'var(--foreground)' }}>
              Correo Electrónico
            </label>
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-600 opacity-50 group-focus-within:opacity-100 transition-opacity">
                <Mail size={18} />
              </div>
              <input 
                {...register('email')} 
                type="email" 
                placeholder="ejemplo@correo.com" 
                className="w-full rounded-2xl py-4 pl-12 pr-4 text-sm font-bold outline-none transition-all border-2 bg-transparent focus:border-blue-500"
                style={{ borderColor: 'var(--border-theme)', color: 'var(--foreground)' }}
              />
            </div>
            {errors.email && <p className="text-red-500 text-[9px] font-black uppercase tracking-tight mt-1 ml-2">{errors.email.message}</p>}
          </div>

          {/* INPUT PASSWORD */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 ml-2"
                   style={{ color: 'var(--foreground)' }}>
              Contraseña
            </label>
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-600 opacity-50 group-focus-within:opacity-100 transition-opacity">
                <Lock size={18} />
              </div>
              <input 
                {...register('password')} 
                type="password" 
                placeholder="••••••••" 
                className="w-full rounded-2xl py-4 pl-12 pr-4 text-sm font-bold outline-none transition-all border-2 bg-transparent focus:border-blue-500"
                style={{ borderColor: 'var(--border-theme)', color: 'var(--foreground)' }}
              />
            </div>
            {errors.password && <p className="text-red-500 text-[9px] font-black uppercase tracking-tight mt-1 ml-2">{errors.password.message}</p>}
          </div>

          {/* BOTÓN SUBMIT (ESTILO AGREGAR AL CARRITO) */}
          <button 
            type="submit"
            disabled={loading} 
            className="w-full py-5 rounded-2xl font-bold text-sm tracking-widest transition-all shadow-xl uppercase flex items-center justify-center gap-3 group bg-blue-600 text-white hover:bg-blue-500 shadow-blue-500/20 active:scale-95 disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="animate-spin" />
            ) : (
              <>
                Entrar al sistema
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform"/>
              </>
            )}
          </button>
        </form>

        {/* FOOTER INTERNO */}
        <div className="mt-8 pt-8 border-t text-center" style={{ borderColor: 'var(--border-theme)' }}>
           <div className="flex justify-center gap-4 opacity-40">
              <Zap size={14} style={{ color: 'var(--foreground)' }} />
              <span className="text-[9px] font-black uppercase tracking-widest" style={{ color: 'var(--foreground)' }}>
                Conexión segura 256-bit
              </span>
           </div>
        </div>
      </div>
    </>
  );
};