import { NextResponse } from 'next/server';
import connectDB from "@/lib/mongodb";
import { Category } from '@/models/Category';

// GET: Obtener todas las categorías
export async function GET() {
  try {
    await connectDB();
    const categories = await Category.find({}).sort({ name: 1 }); // Ordenadas alfabéticamente
    return NextResponse.json(categories);
  } catch (error) {
    return NextResponse.json(
      { error: 'Error al obtener categorías' },
      { status: 500 }
    );
  }
}

// POST: Crear una nueva categoría
export async function POST(request: Request) {
  try {
    await connectDB();
    const { name } = await request.json();

    if (!name) {
      return NextResponse.json(
        { error: 'El nombre es obligatorio' },
        { status: 400 }
      );
    }

    // Normalizar el nombre (Ej: "celulares" -> "Celulares")
    const formattedName = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();

    // Verificar si ya existe
    const existingCategory = await Category.findOne({ name: formattedName });
    if (existingCategory) {
      return NextResponse.json(existingCategory); // Si existe, devolvemos la que ya está
    }

    // Crear slug simple para la URL
    const slug = formattedName.toLowerCase().replace(/ /g, '-');

    const newCategory = await Category.create({
      name: formattedName,
      slug
    });

    return NextResponse.json(newCategory, { status: 201 });
  } catch (error) {
    console.error("Error API Category:", error);
    return NextResponse.json(
      { error: 'Error al crear la categoría' },
      { status: 500 }
    );
  }
}