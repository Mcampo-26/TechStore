import { Suspense } from "react"; 
import { getProductsServer } from "@/lib/products-server";
import ProductosClientContent from "./ProductosClientContent";

// Forzamos que siempre pida datos frescos
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function Page() {
  let products = [];
  let error = null;

  try {
    // Intentamos traer los productos desde el servidor
    products = await getProductsServer();
  } catch (e) {
    console.error("Error al obtener productos:", e);
    error = "No se pudo conectar con el servidor de productos.";
  }

  return (
    <main className="max-w-7xl mx-auto min-h-screen">
      {/* Si hay un error de red, mostramos un aviso en lugar de 
          dejar que la página rompa el flujo del spinner.
      */}
      {error ? (
        <div className="pt-40 text-center px-6">
          <h2 className="text-xl font-bold text-red-500 mb-2">Error de Conexión</h2>
          <p className="opacity-50 text-sm uppercase tracking-widest">{error}</p>
          <button 
           
            className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-xl text-xs font-black uppercase tracking-widest"
          >
            Reintentar
          </button>
        </div>
      ) : (
        <Suspense 
          fallback={
            <div className="pt-40 text-center opacity-20 font-black uppercase tracking-[0.5em] animate-pulse">
              Sincronizando Inventario...
            </div>
          }
        >
          <ProductosClientContent 
            initialProducts={products || []} 
          />
        </Suspense>
      )}
    </main>
  );
}