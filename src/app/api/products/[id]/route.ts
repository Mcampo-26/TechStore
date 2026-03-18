import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";
import { revalidateTag } from "next/cache";

type Props = { params: Promise<{ id: string }> };

export async function GET(req: Request, { params }: Props) {
  try {
    await connectDB();
    const { id } = await params;
    const product = await Product.findById(id);
    if (!product) return NextResponse.json({ error: "No encontrado" }, { status: 404 });
    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json({ error: "Error al obtener" }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: Props) {
  try {
    await connectDB();
    const { id } = await params;
    const body = await req.json();

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true, runValidators: true }
    );

    if (!updatedProduct) return NextResponse.json({ error: "No encontrado" }, { status: 404 });

    // ✨ LIMPIEZA DE CACHÉ: Avisamos que los datos cambiaron
    revalidateTag("products", "default");

    return NextResponse.json(updatedProduct);
  } catch (error: any) {
    return NextResponse.json({ error: "Error al actualizar" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: Props) {
  try {
    await connectDB();
    const { id } = await params;
    const deleted = await Product.findByIdAndDelete(id);

    if (deleted) {
      // ✨ LIMPIEZA DE CACHÉ
      revalidateTag("products", "default");
    }

    return NextResponse.json({ message: "Producto eliminado" });
  } catch (error) {
    return NextResponse.json({ error: "Error al eliminar" }, { status: 500 });
  }
}