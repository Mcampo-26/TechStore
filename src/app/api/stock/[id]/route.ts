import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Stock from '@/models/Stock';
import MovimientoStock from '@/models/MovimientoStock';

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> } // Definimos params como Promise
) {
  try {
    await connectDB();
    
    // 1. DESENVOLVER PARÁMETROS (Corrección para Next.js 16)
    const resolvedParams = await params; 
    const { id } = resolvedParams;

    if (!id) {
      return NextResponse.json({ msg: "ID de producto no proporcionado" }, { status: 400 });
    }

    const body = await req.json();
    const { tipo, cantidad, usuarioId, notas } = body;
    const cantidadNumerica = Number(cantidad);

    // 2. Buscar o Crear el Stock asegurando el ID
    let stockDoc = await Stock.findOne({ producto: id });

    if (!stockDoc) {
      stockDoc = new Stock({
        producto: id, 
        totalQuantity: 0,
        lotes: [],
        stockMinimo: 5
      });
    }

    // 3. Lógica de Lotes (para disparar el middleware pre-save del modelo)
    if (tipo === 'entrada') {
      stockDoc.lotes.push({
        codigo: `LOT-${Date.now().toString().slice(-6)}`,
        cantidad: cantidadNumerica,
        cantidadInicial: cantidadNumerica,
        costoUnitario: 0,
        ubicacion: "Deposito Central"
      });
    } else if (tipo === 'salida') {
      if (stockDoc.totalQuantity < cantidadNumerica) {
        return NextResponse.json({ msg: 'Stock insuficiente' }, { status: 400 });
      }

      let restante = cantidadNumerica;
      for (let lote of stockDoc.lotes) {
        if (lote.cantidad >= restante) {
          lote.cantidad -= restante;
          restante = 0;
          break;
        } else {
          restante -= lote.cantidad;
          lote.cantidad = 0;
        }
      }
      stockDoc.lotes = stockDoc.lotes.filter((l: any) => l.cantidad > 0);
    }

    // 4. GUARDAR (Sincroniza totalQuantity con los lotes)
    await stockDoc.save();

    // 5. REGISTRAR MOVIMIENTO
    const nuevoMovimiento = await MovimientoStock.create({
      producto: id,
      tipo,
      cantidad: cantidadNumerica,
      referenciaTipo: 'ajuste_manual',
      usuario: usuarioId || "Admin Mauricio",
      notas: notas || "Ajuste manual de inventario",
      saldoResultante: stockDoc.totalQuantity
    });

    return NextResponse.json({
      success: true,
      stock: stockDoc,
      movimiento: nuevoMovimiento
    });

  } catch (error: any) {
    console.error('SERVER ERROR:', error);
    return NextResponse.json({ 
      msg: error.message || 'Error interno del servidor' 
    }, { status: 500 });
  }
}