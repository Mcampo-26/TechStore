import { getProductsServer, getCategoriesServer } from "@/lib/products-server";
import AdminClientContent from "./AdminClientContent";

interface SearchParams {
  q?: string;
}

export default async function AdminPage({ 
  searchParams 
}: { 
  searchParams: any // En Next.js 15+ esto es una Promise
}) {
  const params = await searchParams;
  const query = params.q || "";

  const [allProducts, allCategories] = await Promise.all([
    getProductsServer(),
    getCategoriesServer()
  ]);
  
  // Si no hay productos en la DB, esto devolverá un array vacío
  const filteredProducts = allProducts.filter((p: any) => 
    p.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <AdminClientContent 
      products={filteredProducts} 
      initialCategories={allCategories} 
    />
  );
}