"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense, useCallback } from "react";
import Loading from "@/app/productos/[id]/loading"; 

function RouteChangeHandler() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);

  // Función para activar el loading instantáneamente
  const showLoading = useCallback(() => {
    document.body.style.cursor = 'wait';
    setIsLoading(true);
  }, []);

  useEffect(() => {
    // 1. ESCUCHA NATIVA (BOTÓN ATRÁS)
    // Esto detecta el click en "atrás" antes de que Next.js procese la ruta
    window.addEventListener("popstate", showLoading);

    // 2. DETECCIÓN POR CAMBIO DE RUTA (LINKS)
    showLoading();
  
    const timer = setTimeout(() => {
      setIsLoading(false);
      document.body.style.cursor = 'default';
      window.scrollTo({ top: 0, behavior: 'instant' });
    }, 400); // Reducimos a 400ms para que se sienta más "eléctrico"
  
    return () => {
      window.removeEventListener("popstate", showLoading);
      clearTimeout(timer);
      document.body.style.cursor = 'default';
    };
  }, [pathname, searchParams, showLoading]);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-[var(--background)] flex items-center justify-center pointer-events-auto">
      {/* Eliminamos el backdrop-blur para ganar velocidad de pintado (GPU) */}
      <Loading />
    </div>
  );
}

export default function RouteChangeListener() {
  return (
    <Suspense fallback={null}>
      <RouteChangeHandler />
    </Suspense>
  );
}