"use client";

import { RegisterForm } from '@/components/auth/RegisterForm';
import { Laptop } from 'lucide-react';

export default function RegisterPage() {
  return (
    <div className="min-h-screen pt-32 pb-20 px-6 transition-colors duration-300" 
         style={{ backgroundColor: 'var(--background)' }}>
      
      <div className="max-w-md mx-auto">
        
        <div className="flex flex-col items-center mb-8 text-center">
          {/* Icono con estética de ProductoDetalle */}
          <div className="bg-blue-600/10 p-4 rounded-[1.5rem] text-blue-600 mb-4 border"
               style={{ borderColor: 'var(--border-theme)' }}>
            <Laptop size={32} />
          </div>
          
          {/* Badge superior */}
          <span className="bg-blue-600/10 text-blue-600 text-[10px] font-black px-2 py-1 rounded-lg uppercase tracking-widest mb-2">
            Registro Oficial
          </span>

          {/* Títulos con tracking pesado y colores dinámicos */}
          <h1 className="text-3xl font-black leading-tight tracking-tighter uppercase" 
              style={{ color: 'var(--foreground)' }}>
            CREAR CUENTA
          </h1>
          <p className="text-xs font-bold opacity-50 mt-1 uppercase tracking-wider" 
             style={{ color: 'var(--foreground)' }}>
            Únete a la comunidad de TechStore.
          </p>
        </div>

        {/* Componente del Formulario - Contiene su propia tarjeta con rounded-[2.5rem] */}
        <RegisterForm />

        {/* Footer con link corregido para legibilidad técnica */}
        <p className="mt-8 text-center text-[10px] font-black uppercase tracking-widest opacity-60" 
           style={{ color: 'var(--foreground)' }}>
          ¿Ya tienes cuenta?{' '}
          <a 
            href="/login" 
            className="text-blue-600 font-black hover:underline transition-colors"
          >
            Inicia sesión
          </a>
        </p>

      </div>
    </div>
  );
}