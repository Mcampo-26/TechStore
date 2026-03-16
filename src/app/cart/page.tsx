import { getProductsServer } from "@/lib/products-server";
import CarritoClient from "./CarritoClient";
import { Suspense } from "react";

export default async function CarritoPage() {
  // Traemos los productos frescos del servidor para validar stock
  const products = await getProductsServer();

  return (
    <Suspense fallback={<CarritoLoading />}>
      <CarritoClient initialProducts={products} />
    </Suspense>
  );
}

function CarritoLoading() {
  return (
    <div className="min-h-screen pt-32 flex flex-col items-center justify-center" style={{ backgroundColor: 'var(--background)' }}>
      <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="text-[10px] font-black tracking-widest uppercase" style={{ color: 'var(--foreground)' }}>Sincronizando carrito...</p>
    </div>
  );
}