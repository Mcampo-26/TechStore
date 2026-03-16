import { getProductsServer } from "@/lib/products-server";
import HomeClient from "./HomeClient";
import { Suspense } from "react";

export default async function Home() {
  // Traemos los productos directamente desde el servidor (MongoDB)
  const products = await getProductsServer();

  return (
    // El Suspense mostrará tu LoadingState mientras se conecta a la DB
    <Suspense fallback={<HomeLoading />}>
      <HomeClient initialProducts={products} />
    </Suspense>
  );
}

function HomeLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--background)' }}>
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="animate-pulse font-bold tracking-tighter" style={{ color: 'var(--foreground)' }}>
          TECH<span className="text-blue-600">STORE</span>
        </p>
      </div>
    </div>
  );
}