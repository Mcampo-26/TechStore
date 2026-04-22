import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Stock from '@/models/Stock';
import Movimiento from '@/models/MovimientoStock';
import Product from '@/models/Product'; 

export async function GET() {
  try {
    await connectDB();

    // 1. Buscamos el stock y populamos el producto
    const stocks = await Stock.find({})
      .populate({
        path: 'producto',
        select: 'name price image category', // Asegúrate si es 'image' o 'images' en tu modelo
        model: Product
      })
      .sort({ updatedAt: -1 });

    // 2. Traer movimientos de forma eficiente
    const stockWithMovements = await Promise.all(
      stocks.map(async (s) => {
        // Validación: Si el producto no existe (fue borrado), evitamos errores
        const productId = s.producto?._id || s.producto;
        
        if (!productId) return { ...s.toObject(), movimientos: [] };

        const movimientos = await Movimiento.find({ producto: productId })
          .sort({ createdAt: -1 })
          .limit(10);

        return {
          ...s.toObject(),
          movimientos
        };
      })
    );

    return NextResponse.json(stockWithMovements, {
        headers: { 'Cache-Control': 'no-store' }
    });
  } catch (error: any) {
    console.error('❌ Error en GET /api/stock:', error.message);
    return NextResponse.json(
      { error: 'Error al obtener el inventario', details: error.message },
      { status: 500 }
    );
  }
}