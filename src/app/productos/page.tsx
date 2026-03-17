  import { getProductsServer } from "@/lib/products-server";
  import ProductosClientContent from "./ProductosClientContent";
  import { Suspense } from "react";

  interface PageProps {
    // searchParams DEBE ser una Promise en versiones recientes
    searchParams: Promise<{ categoria?: string }>;
  }

  export default async function ProductosPage({ searchParams }: PageProps) {
    const products = await getProductsServer();
    const resolvedSearchParams = await searchParams; // <--- ERROR SOLUCIONADO AQUÍ
    
    const categoriaActiva = resolvedSearchParams.categoria || "Todas";

    return (
      <Suspense fallback={<div className="h-screen flex items-center justify-center">Cargando catálogo...</div>}>
        <ProductosClientContent 
          initialProducts={products} 
          activeCategory={categoriaActiva} 
        />
      </Suspense>
    );
  }