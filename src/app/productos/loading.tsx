// app/productos/[id]/loading.tsx
import React from "react";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[var(--background)]">
      <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      <p className="mt-4 text-[10px] font-black tracking-widest text-blue-600 uppercase animate-pulse">
        Cargando ...
      </p>
    </div>
  );
}