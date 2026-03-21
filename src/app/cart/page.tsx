import { getProductsServer } from "@/lib/products-server";
import CarritoClient from "./CarritoClient";
import { Suspense } from "react";

export default async function CarritoPage() {
  const products = await getProductsServer();

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <Suspense fallback={<CarritoLoading />}>
        <CarritoClient initialProducts={products} />
      </Suspense>
    </div>
  );
}

function CarritoLoading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--background)]">
      <div className="relative">
        <div className="w-12 h-12 border-4 border-blue-600/20 rounded-full"></div>
        <div className="absolute top-0 left-0 w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
      <p className="text-[10px] font-black tracking-[0.3em] uppercase mt-6 text-[var(--foreground)] opacity-40">
        Preparando tu selección
      </p>
    </div>
  );
}