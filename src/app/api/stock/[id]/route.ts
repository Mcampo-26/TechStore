import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";
import MovimientoStock from "@/models/MovimientoStock";
import Log from "@/models/Log"; 

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await params; 
    
    const { cantidad, tipo, motivo, usuarioNombre, usuarioId } = await req.json();

    const producto = await Product.findById(id);
    if (!producto) return NextResponse.json({ error: "Producto no encontrado" }, { status: 404 });

    const stockActual = Number(producto.stock) || 0;
    const variacion = tipo === 'entrada' ? Number(cantidad) : -Number(cantidad);
    const nuevoSaldo = stockActual + variacion;

    if (nuevoSaldo < 0) {
      return NextResponse.json({ error: "No hay stock suficiente" }, { status: 400 });
    }

    // 1. Crear movimiento de stock
    const nuevoMovimiento = await MovimientoStock.create({
      producto: id,
      tipo: tipo,
      cantidad: Number(cantidad),
      referenciaTipo: 'ajuste_manual', 
      usuario: usuarioNombre || "Admin Sistema", 
      notas: motivo || `Ajuste manual de ${tipo}`,
      saldoResultante: nuevoSaldo,
      createdAt: new Date(),
    });

    // 2. Actualizar producto
    producto.stock = nuevoSaldo;
    await producto.save();

    // 3. REGISTRO EN LA AUDITORÍA GENERAL (LOGS)
    try {
      // Usamos producto.name (como indica tu error de TS) o un fallback
      const nombreProducto = (producto as any).name || (producto as any).nombre || "Producto";

      await Log.create({
        tipo: tipo === 'entrada' ? 'STOCK_IN' : 'STOCK_OUT',
        nivel: 'info',
        usuarioId: usuarioId || null,
        usuarioNombre: usuarioNombre || "Sistema",
        detalles: `Cambio de stock en ${nombreProducto}: ${stockActual} -> ${nuevoSaldo}`,
        metadata: {
          productoId: id,
          motivo: motivo || 'Ajuste manual'
        }
      });
    } catch (logError) {
      console.error("⚠️ Error log auditoría:", logError);
    }

    return NextResponse.json({ 
      success: true, 
      nuevoTotal: nuevoSaldo, 
      nuevoLog: nuevoMovimiento 
    });

  } catch (error: any) {
    console.error("Error al guardar movimiento:", error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}