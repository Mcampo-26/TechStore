import { getProductsServer,getCategoriesServer } from "@/lib/products-server"; // Asegúrate de la ruta correcta
import AdminClientContent from "./AdminClientContent";

export default async function AdminPage() {
  // Llamada directa a DB: más rápido, sin errores de URL "undefined"
  const [products, categories] = await Promise.all([
    getProductsServer(),
    getCategoriesServer()
  ]);
  return (
    <div className="min-h-screen pt-24 pb-20 px-4 md:px-10 bg-[var(--background)]">
      <div className="max-w-7xl mx-auto">
      <AdminClientContent 
    initialProducts={products} 
    initialCategories={categories} // <--- Pasar esto es clave
  />
      </div>
    </div>
  );
}