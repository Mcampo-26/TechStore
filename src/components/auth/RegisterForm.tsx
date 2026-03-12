"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema, RegisterInput } from '@/lib/zod';
import { useAuthStore } from '@/store/useAuthStore';
import { useState } from 'react';
import { Loader2, Mail, Lock, User, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

export const RegisterForm = () => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const setLogin = useAuthStore((state) => state.setLogin);
  const router = useRouter();

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema)
  });

  const onSubmit = async (data: RegisterInput) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
  
      // Si la respuesta no es un JSON válido o la ruta no existe, res.json() fallará
      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("El servidor no devolvió JSON. Revisa la ruta de la API.");
      }
  
      const result = await res.json();
      
      if (!res.ok) throw new Error(result.message || 'Error en el registro');
  
      setLogin(result.user);
      router.push('/');
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {error && (
        <div className="p-4 bg-red-50 text-red-500 rounded-2xl text-sm border border-red-100 italic">
          {error}
        </div>
      )}
      
      {/* CAMPO NOMBRE */}
      <div>
        <div className="relative">
          <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            {...register('name')} 
            type="text" 
            placeholder="Nombre completo" 
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 transition-all text-slate-700" 
          />
        </div>
        {errors.name && <p className="text-red-500 text-xs mt-1 ml-1">{errors.name.message}</p>}
      </div>

      {/* CAMPO EMAIL */}
      <div>
        <div className="relative">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            {...register('email')} 
            type="email" 
            placeholder="Correo electrónico" 
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 transition-all text-slate-700" 
          />
        </div>
        {errors.email && <p className="text-red-500 text-xs mt-1 ml-1">{errors.email.message}</p>}
      </div>

      {/* CAMPO PASSWORD */}
      <div>
        <div className="relative">
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            {...register('password')} 
            type="password" 
            placeholder="Contraseña" 
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 transition-all text-slate-700" 
          />
        </div>
        {errors.password && <p className="text-red-500 text-xs mt-1 ml-1">{errors.password.message}</p>}
      </div>

      {/* CONFIRMAR PASSWORD */}
      <div>
        <div className="relative">
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            {...register('confirmPassword')} 
            type="password" 
            placeholder="Confirmar contraseña" 
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 transition-all text-slate-700" 
          />
        </div>
        {errors.confirmPassword && <p className="text-red-500 text-xs mt-1 ml-1">{errors.confirmPassword.message}</p>}
      </div>

      <button 
        disabled={loading} 
        className="w-full bg-blue-600 text-white font-bold py-4 rounded-2xl hover:bg-blue-700 transition-all flex items-center justify-center gap-2 group shadow-xl shadow-blue-100 disabled:opacity-70 mt-4"
      >
        {loading ? <Loader2 className="animate-spin" /> : (
          <>
            Crear cuenta 
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform"/>
          </>
        )}
      </button>
    </form>
  );
};