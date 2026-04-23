import connectDB from '@/lib/mongodb';
import Stock from '../models/Stock'; // Tu modelo de Lotes/Stock
import Product from '@/models/Product'; // Tu modelo de Productos

export async function getFullInventory() {
  await connectDB();

  // Traemos todos los registros de la colección Stock
  const inventory = await Stock.find({})
    .populate({
      path: 'producto',
      model: Product,
      // IMPORTANTE: Agregamos 'stock' al select para traer ese 56 de la DB
      select: 'name image images category stock' 
    })
    .lean();

  // Normalizamos la respuesta: 
  // Si el stock real vive en el Producto, lo priorizamos aquí
  return inventory.map((item: any) => ({
    ...item,
    // Si el producto poblado tiene el stock (el 56), lo usamos. 
    // Si no, usamos el totalQuantity del registro de stock.
    stock: item.producto?.stock ?? item.totalQuantity ?? 0,
    _id: item._id.toString(), // Convertimos para evitar errores de serialización en Next.js
  }));
}