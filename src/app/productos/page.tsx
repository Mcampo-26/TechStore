import { getProductsServer } from "@/lib/products-server";
import ProductosClientContent from "./ProductosClientContent";
import { Suspense } from "react";
import { Product } from "@/types";
import Link from "next/link";
import { ChevronLeft } from "lucide-react"; // Asegúrate de tener lucide-react

export default async function ProductosPage({ 
  searchParams 
}: { 
  searchParams: Promise<{ categoria?: string }> 
}) {
  const resolvedParams = await searchParams;
  const categoriaActiva = resolvedParams.categoria || "Todas";

  let allProducts: Product[] = [];
  try {
    allProducts = await getProductsServer() || [];
  } catch (error) {
    console.error("Error cargando productos:", error);
  }

  const filteredProducts = categoriaActiva === "Todas" 
    ? allProducts 
    : allProducts.filter((p: Product) => p.category === categoriaActiva);

  return (
    <div className="min-h-screen bg-[var(--background)] pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        
        {/* BOTÓN VOLVER ESTILO CARRITO */}
        <Link 
  href="/productos" // Te lleva al listado completo de todos los productos
  className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] opacity-40 hover:opacity-100 transition-all group w-fit mb-6"
  style={{ color: 'var(--foreground)' }}
>
  <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
  Volver al Catálogo
</Link>

        <Suspense 
          key={categoriaActiva} 
          fallback={
            <div className="h-[50vh] flex flex-col items-center justify-center">
              <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="font-black uppercase tracking-[0.2em] text-[10px] opacity-40" style={{ color: 'var(--foreground)' }}>
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
    </div>
  );
}