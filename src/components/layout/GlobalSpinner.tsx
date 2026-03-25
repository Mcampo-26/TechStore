"use client";

import { useProductStore } from "@/store/useProductStore";
import { useEffect, useState } from "react";

export default function GlobalSpinner() {
  const isLoading = useProductStore((state) => state.isLoading);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Limpieza de seguridad: si el spinner queda pegado > 2s, lo matamos
    const t = setTimeout(() => {
      if (isLoading) useProductStore.getState().setLoading(false);
    }, 2000);
    return () => clearTimeout(t);
  }, [isLoading]);

  if (!mounted || !isLoading) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[var(--background)]">
      <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      <p className="mt-4 text-[10px] font-black tracking-widest text-blue-600 uppercase animate-pulse">
        Cargando Sistema
      </p>
    </div>
  );
}