import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Stock from '@/models/Stock'; 
import Movimiento from '@/models/MovimientoStock';

// Definimos la interfaz para los params (Next.js 15 requiere Promise)
interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function POST(req: NextRequest, { params }: RouteParams) {
  try {
    // 1. Conectar a la base de datos de inmediato
    await connectDB();

    // 2. Resolver parámetros de la URL y cuerpo de la petición
    const { id: productId } = await params;
    const body = await req.json();
    const { cantidad, tipo, motivo, usuarioId } = body;

    // 3. Validaciones preventivas
    if (!productId || productId === 'undefined') {
      return NextResponse.json({ msg: 'ID de producto no válido' }, { status: 400 });
    }

    if (!usuarioId) {
      return NextResponse.json({ msg: 'El ID de usuario es obligatorio' }, { status: 400 });
    }

    const cantidadNumerica = Number(cantidad);
    if (isNaN(cantidadNumerica) || cantidadNumerica <= 0) {
      return NextResponse.json({ msg: 'La cantidad debe ser un número positivo' }, { status: 400 });
    }

    console.log(`🚀 Procesando ${tipo} para producto: ${productId} por usuario: ${usuarioId}`);

    // 4. Buscar o inicializar el documento de Stock
    let stockDoc = await Stock.findOne({ producto: productId });

    if (!stockDoc) {
      console.log("🆕 Creando nuevo registro de stock...");
      stockDoc = new Stock({
        producto: productId,
        totalQuantity: 0,
        stockMinimo: 0,
        lotes: []
      });
    }

    // 5. Lógica de actualización de saldo
    const saldoAnterior = stockDoc.totalQuantity;
    if (tipo === 'entrada') {
      stockDoc.totalQuantity += cantidadNumerica;
    } else if (tipo === 'salida') {
      // Opcional: Validar si hay stock suficiente para una salida
      if (stockDoc.totalQuantity < cantidadNumerica) {
        return NextResponse.json({ msg: 'Stock insuficiente para realizar la salida' }, { status: 400 });
      }
      stockDoc.totalQuantity -= cantidadNumerica;
    }

    // 6. Persistencia (Guardar cambios)
    await stockDoc.save();

    // 7. Registro en el historial (Movimiento)
    // Usamos el usuarioId que viene del frontend (Zustand)
    const nuevoMov = await Movimiento.create({
      producto: productId,
      tipo: tipo,
      cantidad: cantidadNumerica,
      saldoResultante: stockDoc.totalQuantity,
      referenciaTipo: 'ajuste_manual',
      notas: motivo || `Movimiento de ${tipo} manual`,
      usuario: usuarioId, 
      createdAt: new Date()
    });

    console.log("✅ Stock y Movimiento guardados con éxito");

    return NextResponse.json({ 
      msg: 'Operación exitosa',
      updatedStock: stockDoc,
      newMovimiento: nuevoMov
    }, { status: 200 });

  } catch (error: any) {
    console.error("❌ Error Crítico en API Stock:", error);
    return NextResponse.json({ 
      msg: 'Error interno del servidor', 
      error: error.message 
    }, { status: 500 });
  }
}