"use client";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, LoginInput } from '@/lib/zod';
import { useAuthStore } from '@/store/useAuthStore';
import { useCartStore } from '@/store/useCartStore'; // IMPORTANTE: Traemos el store del carrito
import { useState } from 'react';
import { Loader2, Mail, Lock, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { LoadingOverlay } from "@/components/ui/LoadingOverlay";

export const LoginForm = () => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const setLogin = useAuthStore((state) => state.setLogin);
  const setCart = useCartStore((state) => state.setCart); // Función para inyectar el carrito
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

      // 1. Guardamos la sesión en el AuthStore
      setLogin(result.user); 

      // 2. CARGAMOS EL CARRITO DEL USUARIO (Si existe en la base de datos)
      if (result.user.cart && result.user.cart.length > 0) {
        setCart(result.user.cart);
      } else {
        // Opcional: Si el usuario no tiene carrito en DB, 
        // podrías decidir si limpiar el local o mantenerlo.
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
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {error && (
          <div className="p-4 bg-red-50 text-red-500 rounded-2xl text-sm border border-red-100 italic">
            {error}
          </div>
        )}
        
        <div>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              {...register('email')} 
              type="email" 
              placeholder="Email" 
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 transition-all" 
            />
          </div>
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
        </div>

        <div>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              {...register('password')} 
              type="password" 
              placeholder="Contraseña" 
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 transition-all" 
            />
          </div>
          {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
        </div>

        <button 
          type="submit"
          disabled={loading} 
          className="w-full bg-slate-900 text-white font-bold py-4 rounded-2xl hover:bg-blue-600 transition-all flex items-center justify-center gap-2 group shadow-xl disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="animate-spin" />
          ) : (
            <>
              Entrar 
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform"/>
            </>
          )}
        </button>
      </form>
    </>
  );
};