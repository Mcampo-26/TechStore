import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";
import { Category } from "@/models/Category";
import { unstable_cache } from 'next/cache';
import mongoose from "mongoose";
import { cache } from 'react';

// --- HELPER DE RENDIMIENTO Y LIMPIEZA ---
const parseDBDoc = (doc: any) => {
  if (!doc) return null;
  // Si es un documento de Mongoose, lo convertimos a objeto plano
  const obj = doc.toObject ? doc.toObject() : doc;
  
  // Convertimos el ID a string para evitar errores de serialización
  obj._id = obj._id.toString();
  
  const cleanImage = (img: any) => (typeof img === 'string' && img.trim() !== "") ? img : null;
  
  obj.image = cleanImage(obj.image);
  obj.image2 = cleanImage(obj.image2);
  obj.image3 = cleanImage(obj.image3);
  
  // Aseguramos que el stock sea un número (el 56 que ves en Mongo)
  obj.stock = Number(obj.stock) || 0;
  
  if (obj.createdAt) obj.createdAt = obj.createdAt instanceof Date ? obj.createdAt.toISOString() : obj.createdAt;
  if (obj.updatedAt) obj.updatedAt = obj.updatedAt instanceof Date ? obj.updatedAt.toISOString() : obj.updatedAt;
  
  return obj;
};

// 1. LISTADO GENERAL
// CAMBIO: revalidate bajado de 3600 a 10 para ver cambios reales rápido
export const getProductsServer = unstable_cache(
  async () => {
    try {
      await connectDB();
      const products = await Product.find({})
        .select('name price image image2 image3 category stock isOferta descuento slug description') 
        .sort({ createdAt: -1 })
        .lean();

      return products.map(parseDBDoc);
    } catch (error) {
      console.error("CRITICAL_DB_ERROR [getProductsServer]:", error);
      return [];
    }
  },
  ["products-list"],
  { revalidate: 10, tags: ["products"] } // 10 segundos es ideal para Admin
);

// 2. DETALLE DE UN PRODUCTO
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

// 3. PRODUCTOS RELACIONADOS
export const getRelatedProducts = cache(async (category: string, currentProductId: string) => {
  if (!category || !mongoose.Types.ObjectId.isValid(currentProductId)) return [];

  try {
    await connectDB();
    const related = await Product.find({ 
      category: category, 
      _id: { $ne: currentProductId } 
    })
    .select('name price image image2 image3 category slug stock') 
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
      .select('name price image image2 image3 category isOferta descuento slug stock')
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