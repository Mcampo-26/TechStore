"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useProductStore } from "@/store/useProductStore";

export default function RouteChangeListener() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const setLoading = useProductStore((state) => state.setLoading);

  useEffect(() => {
    // 1. Filtrar archivos estáticos (favicon, imágenes, etc.)
    const isAsset = pathname.includes('.');
    
    // 2. Definimos las rutas que SÍ deben mostrar el Spinner
    // 🛑 IMPORTANTE: Agregamos '/not-found' aquí porque ahora es una PÁGINA REAL
    const validRoutes = [
      '/', 
      '/productos', 
      '/contacto', 
      '/admin', 
      '/carrito', 
      '/not-found', // <-- Ahora esta ruta es "amiga" del spinner
      '/login',
      '/register'
    ];

    const isProductDetail = pathname.startsWith('/productos/');
    const isValid = validRoutes.includes(pathname) || isProductDetail;

    // 3. Si es un archivo o una ruta que no controlamos, apagamos y salimos
    if (isAsset || !isValid) {
      setLoading(false);
      document.body.style.cursor = 'default';
      return;
    }

    // 4. Lógica del Spinner para rutas válidas
    setLoading(true);
    document.body.style.cursor = 'wait';

    const timer = setTimeout(() => {
      setLoading(false);
      document.body.style.cursor = 'default';
    }, 250); // Mantenemos los 250ms para que se aprecie la animación premium

    return () => {
      clearTimeout(timer);
      setLoading(false);
    };
  }, [pathname, searchParams, setLoading]);

  return null;
}