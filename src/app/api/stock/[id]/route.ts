import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";
import Stock from "@/models/Stock"; // Nuevo modelo de lotes
import MovimientoStock from "@/models/MovimientoStock";
import Log from "@/models/Log"; 

export async function POST(req: Request, { params }: { params: any }) {
  try {
    await connectDB();
    const { id } = await params; 
    
    // Recibimos los nuevos campos: costo, vencimiento y codigo
    const { cantidad, tipo, motivo, usuarioNombre, usuarioId, costo, vencimiento, codigo } = await req.json();

    const producto = await Product.findById(id);
    if (!producto) return NextResponse.json({ error: "Producto no encontrado" }, { status: 404 });

    // --- LÓGICA DE LOTES (Modelo Stock) ---
    let registroStock = await Stock.findOne({ producto: id });
    
    if (!registroStock) {
      // Si no existe el registro de stock para este producto, lo creamos
      registroStock = new Stock({ producto: id, lotes: [], totalQuantity: 0 });
    }

    if (tipo === 'entrada') {
      // AGREGAR NUEVO LOTE
      registroStock.lotes.push({
        codigo: codigo || `LOT-${Date.now().toString().slice(-6)}`,
        cantidad: Number(cantidad),
        cantidadInicial: Number(cantidad),
        costoUnitario: Number(costo) || 0,
        fechaVencimiento: vencimiento ? new Date(vencimiento) : undefined,
        ubicacion: "Deposito Central"
      });
    } else {
      // SALIDA: Restar de los lotes existentes (Lógica FIFO básica)
      let cantidadARestar = Number(cantidad);
      
      // Ordenar por fecha de vencimiento (los que vencen antes salen primero)
      registroStock.lotes.sort((a: any, b: any) => {
        if (!a.fechaVencimiento) return 1;
        if (!b.fechaVencimiento) return -1;
        return new Date(a.fechaVencimiento).getTime() - new Date(b.fechaVencimiento).getTime();
      });

      for (let lote of registroStock.lotes) {
        if (cantidadARestar <= 0) break;
        
        if (lote.cantidad >= cantidadARestar) {
          lote.cantidad -= cantidadARestar;
          cantidadARestar = 0;
        } else {
          cantidadARestar -= lote.cantidad;
          lote.cantidad = 0;
        }
      }

      if (cantidadARestar > 0) {
        return NextResponse.json({ error: "No hay stock suficiente en los lotes" }, { status: 400 });
      }

      // Opcional: Eliminar lotes que quedaron en 0
      registroStock.lotes = registroStock.lotes.filter((l: any) => l.cantidad > 0);
    }

    // Guardar cambios en el Stock (el middleware .pre('save') actualizará totalQuantity automáticamente)
    await registroStock.save();

    // --- ACTUALIZAR PRODUCTO (Mantenemos legacy stock por compatibilidad) ---
    producto.stock = registroStock.totalQuantity;
    await producto.save();

    // --- REGISTROS DE AUDITORÍA ---
    const nuevoMovimiento = await MovimientoStock.create({
      producto: id,
      tipo,
      cantidad: Number(cantidad),
      referenciaTipo: 'ajuste_manual', 
      usuario: usuarioNombre || "Admin Sistema", 
      notas: motivo || `${tipo} de lote ${codigo || 'N/A'}`,
      saldoResultante: registroStock.totalQuantity,
    });

    await Log.create({
      tipo: tipo === 'entrada' ? 'STOCK_IN' : 'STOCK_OUT',
      nivel: 'info',
      usuarioNombre: usuarioNombre || "Sistema",
      detalles: `Movimiento en ${producto.name}. Lote: ${codigo || 'Venta'}. Nuevo Total: ${registroStock.totalQuantity}`,
      metadata: { productoId: id, loteCodigo: codigo }
    });

    return NextResponse.json({ 
      success: true, 
      nuevoTotal: registroStock.totalQuantity,
      stockData: registroStock 
    });

  } catch (error: any) {
    console.error("Error stock controller:", error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}