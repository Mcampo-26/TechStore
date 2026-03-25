import { getProductsServer } from "@/lib/products-server";
import HomeClient from "./HomeClient";
import { Suspense } from "react";

export default async function Home() {
  // Traemos los productos directamente desde el servidor (MongoDB)
  const products = await getProductsServer();

  return (
    // El Suspense mostrará tu LoadingState mientras se conecta a la DB
    <Suspense >
      <HomeClient initialProducts={products} />
    </Suspense>
  );
}

