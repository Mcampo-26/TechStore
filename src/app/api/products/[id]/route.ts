import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";

// --- NUEVO: Agregamos el GET para poder ver el detalle del producto ---
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  console.log(">>> [API] Petición GET recibida");
  try {
    await connectDB();
    const { id } = await params;
    console.log(">>> [API] Buscando ID:", id);

    const product = await Product.findById(id);

    if (!product) {
      console.log(">>> [API] No se encontró el producto en la base de datos");
      return NextResponse.json({ error: "Producto no encontrado" }, { status: 404 });
    }

    console.log(">>> [API] Producto encontrado exitosamente");
    return NextResponse.json(product);
  } catch (error) {
    console.error(">>> [API] Error en GET:", error);
    return NextResponse.json({ error: "Error al obtener el producto" }, { status: 500 });
  }
}

// Tu código de PUT existente
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const body = await req.json();

    console.log(">>> [API] Intentando actualizar ID:", id);
    console.log(">>> [API] Datos recibidos para actualizar:", body);

    // Usamos findByIdAndUpdate con returnDocument: 'after' para evitar el warning
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { $set: body }, // Usamos $set para asegurar que sobrescriba los campos
      { 
        new: true, 
        returnDocument: 'after', 
        runValidators: true // Esto asegura que respete tu modelo
      }
    );

    if (!updatedProduct) {
      console.error(">>> [API] No se encontró el producto para actualizar");
      return NextResponse.json({ error: "Producto no encontrado" }, { status: 404 });
    }

    console.log(">>> [API] Producto actualizado con éxito en DB");
    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error(">>> [API] Error al actualizar:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
// Tu código de DELETE existente
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