import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";
import { Category } from "@/models/Category";
import { unstable_cache } from 'next/cache';
// 1. LISTADO GENERAL
export const getProductsServer = unstable_cache(
  async () => {
    try {
      await connectDB();
      
      // Traemos productos, ordenados por los más nuevos
      const products = await Product.find({})
        .sort({ createdAt: -1 })
        .lean();

      // Limpiamos los IDs de MongoDB para evitar errores de serialización
      return JSON.parse(JSON.stringify(products));
    } catch (error) {
      console.error("CRITICAL_DB_ERROR:", error);
      return [];
    }
  },
  ["products-list"], // Key única para el cache
  { 
    revalidate: 3600, // Revalida cada hora de forma pasiva
    tags: ["products"] // Tag para forzar actualización desde el Admin
  }
);
// 2. DETALLE DE UN PRODUCTO (Por ID)
export async function getProductById(id: string) {
  try {
    await connectDB();
    // .select() ayuda a traer solo lo que vas a mostrar, ignorando campos basura
    const product = await Product.findById(id)
      .select('name price description image image2 image3 category stock isOferta descuento')
      .lean(); 
      
    if (!product) return null;
    
    // Serialización manual rápida (evita el JSON.parse(JSON.stringify))
    return {
      ...product,
      _id: product._id.toString(),
    };
  } catch (error) {
    console.error("Error obteniendo producto por ID:", error);
    return null;
  }
}

// 3. PRODUCTOS RELACIONADOS (Misma categoría, excluyendo el actual)
export async function getRelatedProducts(category: string, currentProductId: string) {
  try {
    await connectDB();
    // Buscamos productos de la misma categoría, limitamos a 4 y excluimos el que ya estamos viendo
    const related = await Product.find({ 
      category: category, 
      _id: { $ne: currentProductId } 
    })
    .limit(4)
    .lean();

    return JSON.parse(JSON.stringify(related));
  } catch (error) {
    console.error("Error obteniendo relacionados:", error);
    return [];
  }
}

// 4. PRODUCTOS EN OFERTA (Para la Home o banners)
export async function getOfferProducts() {
  try {
    await connectDB();
    const offers = await Product.find({ isOferta: true }).limit(8).lean();
    return JSON.parse(JSON.stringify(offers));
  } catch (error) {
    console.error("Error obteniendo ofertas:", error);
    return [];
  }
}

// 5. LISTADO DE CATEGORÍAS
export async function getCategoriesServer() {
  try {
    await connectDB();
    const categories = await Category.find({}).sort({ name: 1 }).lean();
    return JSON.parse(JSON.stringify(categories));
  } catch (error) {
    console.error("Error en getCategoriesServer:", error);
    return [];
  }
}