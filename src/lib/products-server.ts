import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";
import { Category } from "@/models/Category";
import { unstable_cache } from 'next/cache';
import mongoose from "mongoose";

// --- HELPER DE RENDIMIENTO Y LIMPIEZA ---
const parseDBDoc = (doc: any) => {
  if (!doc) return null;
  const obj = doc.toObject ? doc.toObject() : doc;
  
  // Convertimos ID a string para evitar errores de serialización en Server Components
  obj._id = obj._id.toString();
  
  // FIX DE SEGURIDAD PARA IMÁGENES:
  // Si los campos de imagen vienen vacíos o son solo espacios, los convertimos a null
  // Esto evita el error de Next.js: "An empty string ("") was passed to the src attribute"
  const cleanImage = (img: any) => (typeof img === 'string' && img.trim() !== "") ? img : null;
  
  obj.image = cleanImage(obj.image);
  obj.image2 = cleanImage(obj.image2);
  obj.image3 = cleanImage(obj.image3);
  
  // Procesamos fechas
  if (obj.createdAt) obj.createdAt = obj.createdAt.toISOString();
  if (obj.updatedAt) obj.updatedAt = obj.updatedAt.toISOString();
  
  return obj;
};

// 1. LISTADO GENERAL (Cacheado y con Proyección)
export const getProductsServer = unstable_cache(
  async () => {
    try {
      await connectDB();
      // IMPORTANTE: Agregué image, image2, image3 al select para que coincidan con tu ProductCard
      const products = await Product.find({})
        .select('name price image image2 image3 category stock isOferta descuento slug') 
        .sort({ createdAt: -1 })
        .lean();

      return products.map(parseDBDoc);
    } catch (error) {
      console.error("CRITICAL_DB_ERROR:", error);
      return [];
    }
  },
  ["products-list"],
  { revalidate: 3600, tags: ["products"] }
);

// 2. DETALLE DE UN PRODUCTO
export async function getProductById(id: string) {
  if (!mongoose.Types.ObjectId.isValid(id)) return null;

  try {
    await connectDB();
    const product = await Product.findById(id).lean(); 
    return parseDBDoc(product);
  } catch (error) {
    console.error("Error obteniendo producto por ID:", error);
    return null;
  }
}

// 3. PRODUCTOS RELACIONADOS
export async function getRelatedProducts(category: string, currentProductId: string) {
  if (!category || !mongoose.Types.ObjectId.isValid(currentProductId)) return [];

  try {
    await connectDB();
    const related = await Product.find({ 
      category: category, 
      _id: { $ne: currentProductId } 
    })
    .select('name price image image2 image3 category slug') 
    .limit(4)
    .lean();

    return related.map(parseDBDoc);
  } catch (error) {
    console.error("Error obteniendo relacionados:", error);
    return [];
  }
}

// 4. PRODUCTOS EN OFERTA
export async function getOfferProducts() {
  try {
    await connectDB();
    const offers = await Product.find({ isOferta: true })
      .select('name price image image2 image3 category isOferta descuento slug')
      .limit(8)
      .lean();
    return offers.map(parseDBDoc);
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
    return categories.map(parseDBDoc);
  } catch (error) {
    console.error("Error en getCategoriesServer:", error);
    return [];
  }
}