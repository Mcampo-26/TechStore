import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";
import { Category } from "@/models/Category";
// --- PARA EL LISTADO GENERAL (La que necesitas ahora) ---
export async function getProductsServer() {
  await connectDB();
  // Traemos todos los productos de la base de datos
  const products = await Product.find({}).lean();
  
  // Siempre usamos JSON.parse(JSON.stringify()) para limpiar los IDs de MongoDB
  return JSON.parse(JSON.stringify(products));
}

// --- PARA EL DETALLE DE UN PRODUCTO ---
export async function getProductById(id: string) {
  try {
    await connectDB();
    const product = await Product.findById(id).lean(); 
    if (!product) return null;
    
    return JSON.parse(JSON.stringify(product));
  } catch (error) {
    console.error("Error obteniendo producto por ID:", error);
    return null;
  }
}


export async function getCategoriesServer() {
    try {
      await connectDB();
      // Traemos categorías, las ordenamos y limpiamos para el cliente
      const categories = await Category.find({}).sort({ name: 1 }).lean();
      return JSON.parse(JSON.stringify(categories));
    } catch (error) {
      console.error("Error en getCategoriesServer:", error);
      return [];
    }
  }