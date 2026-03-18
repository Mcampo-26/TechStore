import { getProductsServer } from "@/lib/products-server";
import ProductosClientContent from "./ProductosClientContent"; // <--- REVISA ESTO
import { Suspense } from "react";

export default async function ProductosPage({ 
  searchParams 
}: { 
  searchParams: Promise<{ categoria?: string }> 
}) {
  // 1. Resolvemos params primero
  const resolvedParams = await searchParams;
  const categoriaActiva = resolvedParams.categoria || "Todas";

  // 2. Traemos productos
  const allProducts = await getProductsServer() || [];

  // 3. Filtramos
  const filteredProducts = categoriaActiva === "Todas" 
    ? allProducts 
    : allProducts.filter((p: any) => p.category === categoriaActiva);

  return (
    <Suspense fallback={<div className="h-screen flex items-center justify-center">Cargando...</div>}>
      <ProductosClientContent 
        initialProducts={filteredProducts} 
        activeCategory={categoriaActiva} 
      />
    </Suspense>
  );
}