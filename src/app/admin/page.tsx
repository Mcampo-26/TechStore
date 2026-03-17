import { Product } from "@/types";
import AdminClientContent from "./AdminClientContent";
// Importa la función que me acabas de mostrar (ajusta la ruta según donde esté el archivo)
import { getProductsServer } from "@/lib/products-server"

export default async function AdminPage() {
  // Llamada directa a la base de datos (sin fetch, sin errores de URL)
  const initialProducts = await getProductsServer();

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 md:px-10" style={{ backgroundColor: 'var(--background)' }}>
      <div className="max-w-7xl mx-auto">
        <AdminClientContent initialProducts={initialProducts} />
      </div>
    </div>
  );
}