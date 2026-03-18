import { getProductsServer, getCategoriesServer } from "@/lib/products-server";
import AdminClientContent from "./AdminClientContent";

interface SearchParams {
  q?: string;
}

export default async function AdminPage({ 
  searchParams 
}: { 
  searchParams: Promise<SearchParams> 
}) {
  // 1. Extraemos el término de búsqueda de la URL
  const query = (await searchParams).q || "";

  // 2. Traemos todos los datos de MongoDB en paralelo para máxima velocidad
  const [allProducts, allCategories] = await Promise.all([
    getProductsServer(),
    getCategoriesServer()
  ]);
  
  // 3. Filtramos los productos en el SERVIDOR
  // Esto hace que el cliente reciba solo lo necesario
  const filteredProducts = allProducts.filter((p: any) => 
    p.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 md:px-10 bg-[var(--background)]">
      <div className="max-w-7xl mx-auto">
        {/* Pasamos los productos filtrados y las categorías */}
        <AdminClientContent 
          products={filteredProducts} 
          initialCategories={allCategories} 
        />
      </div>
    </div>
  );
}