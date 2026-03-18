import { getProductsServer } from "@/lib/products-server";
import ProductosClientContent from "./ProductosClientContent";
import { Suspense } from "react";
import { Product } from "@/types"; // Importa tu interfaz

export default async function ProductosPage({ 
  searchParams 
}: { 
  searchParams: Promise<{ categoria?: string }> 
}) {
  // 1. Resolución asíncrona de parámetros (Estándar Next 15/16)
  const resolvedParams = await searchParams;
  const categoriaActiva = resolvedParams.categoria || "Todas";

  let allProducts: Product[] = [];

  try {
    // 2. Traemos los productos del servidor
    allProducts = await getProductsServer() || [];
  } catch (error) {
    console.error("Error cargando productos en el servidor:", error);
    // Podrías retornar un componente de error aquí si quisieras
  }

  // 3. Filtrado lógico
  const filteredProducts = categoriaActiva === "Todas" 
    ? allProducts 
    : allProducts.filter((p: Product) => p.category === categoriaActiva);

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* La 'key' en Suspense es vital: 
          Cuando 'categoriaActiva' cambia, React destruye el componente viejo 
          y monta uno nuevo, disparando el useEffect de sincronización del Store.
      */}
      <Suspense 
        key={categoriaActiva} 
        fallback={
          <div className="h-screen flex flex-col items-center justify-center">
            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="font-black uppercase tracking-[0.2em] text-[10px] opacity-50">
              Filtrando {categoriaActiva}...
            </p>
          </div>
        }
      >
        <ProductosClientContent 
          initialProducts={filteredProducts} 
          activeCategory={categoriaActiva} 
        />
      </Suspense>
    </div>
  );
}