import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Product from "@/models/Product";
import { revalidateTag } from "next/cache"; // <--- IMPORTANTE

export async function GET() {
  try {
    await dbConnect();
    const products = await Product.find({}).sort({ createdAt: -1 });
    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    console.error("GET_PRODUCTS_ERROR:", error);
    return NextResponse.json({ message: "Error al obtener los productos" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    const { name, price, image } = body;

    if (!name || !price || !image) {
      return NextResponse.json({ message: "Faltan campos obligatorios" }, { status: 400 });
    }

    const newProduct = await Product.create({
      ...body,
      price: Number(price),
      stock: Number(body.stock || 0)
    });

    // ✨ MAGIA DE NEXT 16: Limpiamos el caché de la lista de productos
    revalidateTag("products", "default");

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error: any) {
    console.error("POST_PRODUCT_ERROR:", error);
    return NextResponse.json({ message: "Error al crear" }, { status: 500 });
  }
}