import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";
import { Category } from "@/models/Category";
import { unstable_cache } from 'next/cache';
import mongoose from "mongoose";
import { cache } from 'react'; // <--- NUEVA IMPORTACIÓN

// --- HELPER DE RENDIMIENTO Y LIMPIEZA ---
const parseDBDoc = (doc: any) => {
  if (!doc) return null;
  const obj = doc.toObject ? doc.toObject() : doc;
  
  obj._id = obj._id.toString();
  
  const cleanImage = (img: any) => (typeof img === 'string' && img.trim() !== "") ? img : null;
  
  obj.image = cleanImage(obj.image);
  obj.image2 = cleanImage(obj.image2);
  obj.image3 = cleanImage(obj.image3);
  
  if (obj.createdAt) obj.createdAt = obj.createdAt.toISOString();
  if (obj.updatedAt) obj.updatedAt = obj.updatedAt.toISOString();
  
  return obj;
};

// 1. LISTADO GENERAL (Sin cambios, ya usa unstable_cache)
export const getProductsServer = unstable_cache(
  async () => {
    try {
      await connectDB();
      const products = await Product.find({})
        // AGREGA 'description' AQUÍ:
        .select('name price image image2 image3 category stock isOferta descuento slug description') 
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

// 2. DETALLE DE UN PRODUCTO (OPTIMIZADO CON CACHE)
// Ahora está envuelto en cache() para evitar peticiones duplicadas en un mismo render
export const getProductById = cache(async (id: string) => {
  if (!mongoose.Types.ObjectId.isValid(id)) return null;

  try {
    await connectDB();
    const product = await Product.findById(id).lean(); 
    return parseDBDoc(product);
  } catch (error) {
    console.error("Error obteniendo producto por ID:", error);
    return null;
  }
});

// 3. PRODUCTOS RELACIONADOS (También optimizado con cache)
export const getRelatedProducts = cache(async (category: string, currentProductId: string) => {
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
});

// 4. PRODUCTOS EN OFERTA
export const getOfferProducts = cache(async () => {
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
});

// 5. LISTADO DE CATEGORÍAS
export const getCategoriesServer = cache(async () => {
  try {
    await connectDB();
    const categories = await Category.find({}).sort({ name: 1 }).lean();
    return categories.map(parseDBDoc);
  } catch (error) {
    console.error("Error en getCategoriesServer:", error);
    return [];
  }
});