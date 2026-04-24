// app/api/stock/sync/route.ts
import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Product from '@/models/Product';
import Stock from '@/models/Stock';

export async function GET() {
  try {
    await connectDB();

    // 1. LIMPIEZA TOTAL: Borramos todos los registros de stock existentes
    // Esto elimina todos los lotes "viejos" para empezar desde cero.
    await Stock.deleteMany({});

    // 2. Obtenemos todos los productos existentes
    const productos = await Product.find({});
    let creados = 0;

    for (const prod of productos) {
      // Tomamos el stock actual del producto para convertirlo en el lote inicial
      const stockActual = Number(prod.stock) || 0;

      // Creamos el registro de Stock desde cero
      await Stock.create({
        producto: prod._id,
        totalQuantity: stockActual,
        stockMinimo: 5,
        costoPromedio: 0,
        lotes: stockActual > 0 ? [{
          codigo: 'INICIO-SISTEMA',
          cantidad: stockActual,
          cantidadInicial: stockActual,
          costoUnitario: 0,
          ubicacion: 'Deposito Central',
          // Agregamos una fecha de vencimiento lejana por defecto para el stock inicial 
          // o lo dejamos undefined si prefieres.
          fechaVencimiento: null, 
          // Usamos una observación clara
          observacion: "Sincronización inicial: Migración de stock base."
        }] : []
      });
      creados++;
    }

    return NextResponse.json({ 
      success: true,
      message: "Base de Stock reseteada y sincronizada con éxito.",
      detalles: {
        productos_procesados: productos.length,
        nuevos_registros_creados: creados,
        estado: "Lotes antiguos eliminados"
      }
    });

  } catch (error: any) {
    console.error("❌ Error en Reinicio de Stock:", error);
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}