import { getProductsServer } from "@/lib/products-server";
import StockClient from "../stock/StockClient"

export default async function StockPage() {
  // Traemos los productos para que el selector pueda buscarlos
  const products = await getProductsServer();

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 md:px-10 bg-[var(--background)]">
      <div className="max-w-4xl mx-auto">
        <StockClient products={products} />
      </div>
    </div>
  );
}