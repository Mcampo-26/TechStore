import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";

// GET: Obtener un producto por ID
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const product = await Product.findById(id);

    if (!product) {
      return NextResponse.json({ error: "Producto no encontrado" }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error(">>> [API GET] Error:", error);
    return NextResponse.json({ error: "Error al obtener el producto" }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const body = await req.json();

    console.log("📥 [API PUT] Datos brutos recibidos:", body);

    // Ahora que el Modelo y el Front coinciden, pasamos el body directamente.
    // Usamos $set para actualizar solo los campos que vienen en el body.
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { $set: body },
      { 
        new: true,           // Devuelve el documento actualizado
        runValidators: true, // Valida que los datos sigan las reglas del esquema
        strict: false        // Permite procesar los campos aunque el modelo esté en caché
      }
    );

    if (!updatedProduct) {
      console.log("❌ [API PUT] No se encontró el producto ID:", id);
      return NextResponse.json({ error: "Producto no encontrado" }, { status: 404 });
    }

    // Log final para verificar que los nombres coinciden
    console.log("💾 [API PUT] Grabado con éxito:", {
      name: updatedProduct.name,
      isOferta: updatedProduct.isOferta,
      descuento: updatedProduct.descuento
    });

    return NextResponse.json(updatedProduct);
  } catch (error: any) {
    console.error("💥 [API PUT] Error crítico:", error.message);
    return NextResponse.json(
      { error: "Error al actualizar: " + error.message }, 
      { status: 500 }
    );
  }
}


// DELETE: Eliminar un producto
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    await Product.findByIdAndDelete(id);
    return NextResponse.json({ message: "Producto eliminado" });
  } catch (error) {
    return NextResponse.json({ error: "Error al eliminar" }, { status: 500 });
  }
}