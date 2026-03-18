import { Product } from "@/types";
import { getProductsServer } from "./products-server";

/**
 * Obtiene únicamente los productos que tienen el flag isOferta en true
 * desde el servidor (simulando una query de base de datos)
 */
export async function getOfertasServer(): Promise<Product[]> {
  try {
    const allProducts = await getProductsServer();
    
    // Si estuviéramos usando MongoDB directamente sería: 
    // return await ProductModel.find({ isOferta: true });
    
    if (!allProducts) return [];
    
    return allProducts.filter((p: Product) => p.isOferta === true);
  } catch (error) {
    console.error("Error al obtener ofertas del servidor:", error);
    return [];
  }
}