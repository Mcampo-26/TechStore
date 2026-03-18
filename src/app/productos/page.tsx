import { getProductsServer } from "@/lib/products-server"; // Donde tengas tu función de servidor
import ProductosClientContent from "./ProductosClientContent";

// FORZAR ACTUALIZACIÓN
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function Page({ searchParams }: any) {
  // Obtenemos los productos usando tu función con unstable_cache
  const products = await getProductsServer();

  // DEBUG: Esto saldrá en tu terminal de VS Code
  console.log(`Página Productos: Cargados ${products?.length || 0} productos`);

  return (
    <main className="max-w-7xl mx-auto pt-20">
      <ProductosClientContent 
        initialProducts={products || []} 
        activeCategory="Catálogo" 
      />
    </main>
  );
}