"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ShoppingBag, ArrowLeft, ShieldCheck } from "lucide-react";

export default function DemoRestriction() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100 p-6">

      <div className="relative w-full max-w-md">

        {/* Glow decorativo */}
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-400/20 to-indigo-400/20 blur-2xl rounded-3xl" />

        <div className="relative bg-white/80 backdrop-blur-xl border border-white/40 shadow-xl rounded-3xl p-8 flex flex-col items-center text-center">

          {/* Icono */}
          <div className="relative mb-6">
            <div className="absolute inset-0 bg-blue-400/20 blur-xl rounded-full" />
            <div className="relative bg-white shadow-md rounded-full p-5">
              <ShoppingBag size={40} className="text-blue-500" />
            </div>
          </div>

          {/* Título */}
          <h1 className="text-xl md:text-2xl font-semibold text-gray-800 mb-3">
            Estás en modo demostración
          </h1>

          {/* Texto */}
          <p className="text-gray-600 text-sm leading-relaxed mb-8 max-w-sm">
            Este proyecto es una <strong>demo funcional para portfolio</strong>.  
            Los pagos están desactivados para evitar transacciones reales y
            proteger la información de los usuarios.
          </p>

          {/* Botones */}
          <div className="w-full flex flex-col gap-3">

            <button
              onClick={() => router.push("/")}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3.5 rounded-xl font-semibold transition-all duration-200 shadow-md hover:shadow-lg"
            >
              Seguir navegando
            </button>

            <button
              onClick={() => router.back()}
              className="w-full flex items-center justify-center gap-2 text-blue-500 hover:text-blue-600 text-sm font-medium py-2 transition"
            >
              <ArrowLeft size={16} />
              Volver al carrito
            </button>

          </div>

          {/* Footer */}
          <div className="flex items-center gap-2 mt-8 text-gray-400 text-xs uppercase tracking-wider">
            <ShieldCheck size={14} />
            Entorno de prueba seguro
          </div>

        </div>
      </div>
    </div>
  );
}