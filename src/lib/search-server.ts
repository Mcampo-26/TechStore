import { Product } from "@/types";
import { getProductsServer } from "./products-server";

export async function searchProductsServer(query: string): Promise<Product[]> {
  if (!query) return [];

  try {
    const allProducts = await getProductsServer();
    const searchTerm = query.toLowerCase().trim();

    // Filtramos por nombre, categoría o descripción
    return allProducts.filter((p: Product) => 
      p.name.toLowerCase().includes(searchTerm) || 
      p.category.toLowerCase().includes(searchTerm) ||
      p.description?.toLowerCase().includes(searchTerm)
    );
  } catch (error) {
    console.error("Error en búsqueda:", error);
    return [];
  }
}