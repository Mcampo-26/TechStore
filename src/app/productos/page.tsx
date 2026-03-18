import { getProductsServer } from "@/lib/products-server";
import ProductosClientContent from "./ProductosClientContent";
import { Suspense } from "react";

export default async function ProductosPage({ 
  searchParams 
}: { 
  searchParams: Promise<{ categoria?: string }> 
}) {
  const resolvedParams = await searchParams;
  const categoriaActiva = resolvedParams.categoria || "Todas";

  const allProducts = await getProductsServer() || [];

  const filteredProducts = categoriaActiva === "Todas" 
    ? allProducts 
    : allProducts.filter((p: any) => p.category === categoriaActiva);

  return (
    // La clave 'key' fuerza a React a resetear el componente cuando cambia la categoría
    <Suspense 
      key={categoriaActiva} 
      fallback={<div className="h-screen flex items-center justify-center font-black uppercase tracking-widest text-xs">Filtrando...</div>}
    >
      <ProductosClientContent 
        initialProducts={filteredProducts} 
        activeCategory={categoriaActiva} 
      />
    </Suspense>
  );
}