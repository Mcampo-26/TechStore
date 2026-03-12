import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Product from "@/models/Product";

// 1. OBTENER TODOS LOS PRODUCTOS (Para la Home y la página de Productos)
export async function GET() {
  try {
    await dbConnect();
    
    // Buscamos todos los productos y los ordenamos por fecha de creación (más nuevos primero)
    const products = await Product.find({}).sort({ createdAt: -1 });

    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    console.error("GET_PRODUCTS_ERROR:", error);
    return NextResponse.json(
      { message: "Error al obtener los productos" },
      { status: 500 }
    );
  }
}

// 2. CREAR UN NUEVO PRODUCTO (Para el panel de Admin)
export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();

    // Validaciones básicas antes de guardar
    const { name, price, description, image, category } = body;

    if (!name || !price || !image) {
      return NextResponse.json(
        { message: "Faltan campos obligatorios (Nombre, Precio, Imagen)" },
        { status: 400 }
      );
    }

    const newProduct = await Product.create({
      name,
      price: Number(price),
      description,
      image,
      category,
      stock: body.stock || 0
    });

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error: any) {
    console.error("POST_PRODUCT_ERROR:", error);
    return NextResponse.json(
      { message: "Error al crear el producto" },
      { status: 500 }
    );
  }
}