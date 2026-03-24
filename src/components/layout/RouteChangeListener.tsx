"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import Loading from "@/app/productos/[id]/loading"; 

function RouteChangeHandler() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // 1. DISPARO INSTANTÁNEO (FUERA DE REACT)
    // Esto se ejecuta antes de que React procese el estado
    document.body.style.cursor = 'wait'; 
    
    setIsLoading(true);
  
    const timer = setTimeout(() => {
      setIsLoading(false);
      document.body.style.cursor = 'default';
      window.scrollTo(0, 0);
    }, 450);
  
    return () => {
      clearTimeout(timer);
      document.body.style.cursor = 'default';
    };
  }, [pathname, searchParams]);

  if (!isLoading) return null;

  return (
    // bg-opacity para que si hay un micro-segundo de delay, se vea fluido
    <div className="fixed inset-0 z-[9999] bg-[var(--background)] flex items-center justify-center backdrop-blur-sm">
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