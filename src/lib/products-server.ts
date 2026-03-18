import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";
import { Category } from "@/models/Category";

// 1. LISTADO GENERAL
export async function getProductsServer() {
  await connectDB();
  const products = await Product.find({}).lean();
  return JSON.parse(JSON.stringify(products));
}

// 2. DETALLE DE UN PRODUCTO (Por ID)
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