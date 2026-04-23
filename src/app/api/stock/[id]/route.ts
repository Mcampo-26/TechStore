import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";
import MovimientoStock from "@/models/MovimientoStock"; 

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await params; 
    
    // Recibimos los datos del front
    const { cantidad, tipo, motivo, usuarioNombre } = await req.json();

    const producto = await Product.findById(id);
    if (!producto) return NextResponse.json({ error: "Producto no encontrado" }, { status: 404 });

    // 1. Cálculo de stock (el 56 de tu Mongo)
    const stockActual = Number(producto.stock) || 0;
    const variacion = tipo === 'entrada' ? Number(cantidad) : -Number(cantidad);
    const nuevoSaldo = stockActual + variacion;

    if (nuevoSaldo < 0) {
      return NextResponse.json({ error: "No hay stock suficiente" }, { status: 400 });
    }

    // 2. Creación del movimiento siguiendo TU NUEVO MODELO
    const nuevoMovimiento = await MovimientoStock.create({
      producto: id,
      tipo: tipo, // 'entrada', 'salida', etc.
      cantidad: Number(cantidad),
      
      // Ajuste para cumplir con el enum: ['venta', 'compra', 'ajuste_manual', 'devolucion_cliente']
      // Si el motivo no es uno de esos, forzamos 'ajuste_manual'
      referenciaTipo: 'ajuste_manual', 
      
      // Tu modelo pide usuario como String y es obligatorio
      usuario: usuarioNombre || "Admin Sistema", 
      
      // Guardamos lo que el usuario escribió en notas
      notas: motivo || `Ajuste manual de ${tipo}`,
      
      // El saldo resultante que calculamos arriba
      saldoResultante: nuevoSaldo,
      
      createdAt: new Date(),
    });

    // 3. ACTUALIZAR EL PRODUCTO (Para que la tabla muestre el número real)
    producto.stock = nuevoSaldo;
    await producto.save();

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