import { Suspense } from "react"; 
import { getProductsServer } from "@/lib/products-server";
import ProductosClientContent from "./ProductosClientContent";

// Estas líneas mantienen el componente como Server Component de carga dinámica
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function Page() {
  // Esta parte se ejecuta en el SERVIDOR
  const products = await getProductsServer();

  return (
    <main className="max-w-7xl mx-auto">
      {/* Mantenemos el componente de servidor, 
          pero protegemos el build de Vercel con Suspense 
      */}
      <Suspense fallback={<div className="pt-40 text-center opacity-20 font-black uppercase tracking-[0.5em]">Cargando Catálogo...</div>}>
        <ProductosClientContent 
          initialProducts={products || []} 
          activeCategory="Catálogo" 
        />
      </Suspense>
    </main>
  );
}