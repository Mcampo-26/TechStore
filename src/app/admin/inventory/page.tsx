// app/admin/inventory/page.tsx (o la ruta donde esté tu página)
import { getProductsServer } from "@/lib/products-server"; // Ajusta esta ruta a tu función real
import InventoryClient from "@/components/admin/InventoryClient"

export default async function InventoryPage() {
  // 1. Obtenemos los productos de la DB
  const products = await getProductsServer();

  return (
    <main>
      {/* 2. Pasamos los productos como la prop 'initialProducts' */}
      <InventoryClient initialProducts={products} />
    </main>
  );
}