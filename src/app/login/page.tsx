"use client";

import { LoginForm } from '@/components/auth/LoginForm';
import { Laptop } from 'lucide-react';

export default function LoginPage() {
  return (
    <div className="min-h-screen pt-32 pb-20 px-6 transition-colors duration-300" 
         style={{ backgroundColor: 'var(--background)' }}>
      
      <div className="max-w-md mx-auto">
        
        <div className="flex flex-col items-center mb-8 text-center">
          {/* Icono con sombra adaptada y bordes estilo detalle */}
          <div className="bg-blue-600/10 p-4 rounded-[1.5rem] text-blue-600 mb-4 border"
               style={{ borderColor: 'var(--border-theme)' }}>
            <Laptop size={32} />
          </div>
          
          {/* Badge superior estilo ProductoDetalle */}
          <span className="bg-blue-600/10 text-blue-600 text-[10px] font-black px-2 py-1 rounded-lg uppercase tracking-widest mb-2">
            Acceso Clientes
          </span>

          {/* Títulos con colores dinámicos y tracking de ProductoDetalle */}
          <h1 className="text-3xl font-black leading-tight tracking-tighter uppercase" 
              style={{ color: 'var(--foreground)' }}>
            HOLA DE NUEVO
          </h1>
          <p className="text-xs font-bold opacity-50 mt-1 uppercase tracking-wider" 
             style={{ color: 'var(--foreground)' }}>
            Tu setup tech te está esperando.
          </p>
        </div>

        {/* Componente del Formulario - El contenedor ahora está dentro de LoginForm según el código anterior */}
        <LoginForm />

        {/* Footer con link corregido para legibilidad estilo ProductoDetalle */}
        <p className="mt-8 text-center text-[10px] font-black uppercase tracking-widest opacity-60" 
           style={{ color: 'var(--foreground)' }}>
          ¿No tienes cuenta?{' '}
          <a 
            href="/register" 
            className="text-blue-600 font-black hover:underline transition-colors"
          >
            Crea una ahora
          </a>
        </p>

      </div>
    </div>
  );
}