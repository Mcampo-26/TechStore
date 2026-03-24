"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import Loading from "@/app/productos/[id]/loading"; 

/**
 * Este componente escucha cambios de ruta y muestra el spinner global.
 */
function RouteChangeHandler() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Activamos el loading al cambiar la URL
    setIsLoading(true);

    // Pequeño delay para que la transición no sea un "parpadeo" molesto
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 400); 

    return () => clearTimeout(timer);
  }, [pathname, searchParams]);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-[var(--background)] flex items-center justify-center">
      <Loading />
    </div>
  );
}

/**
 * Exportamos un Wrapper con Suspense para evitar errores de Next.js 
 * al usar useSearchParams() en componentes de cliente.
 */
export default function RouteChangeListener() {
  return (
    <Suspense fallback={null}>
      <RouteChangeHandler />
    </Suspense>
  );
}