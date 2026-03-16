import { NextResponse } from 'next/server';
import connectDB from "@/lib/mongodb";
import { Category } from '@/models/Category';

// GET: Obtener todas las categorías
export async function GET() {
  try {
    await connectDB();
    // Usamos .lean() para que la consulta sea más rápida y devuelva objetos planos
    const categories = await Category.find({}).sort({ name: 1 }).lean();
    
    // Normalizamos para asegurar que el frontend siempre tenga id disponible
    const normalizedCategories = categories.map((cat: any) => ({
      ...cat,
      id: cat._id.toString()
    }));

    return NextResponse.json(normalizedCategories);
  } catch (error) {
    console.error("GET_CATEGORIES_ERROR:", error);
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

    if (!name || name.trim() === "") {
      return NextResponse.json(
        { error: 'El nombre es obligatorio' },
        { status: 400 }
      );
    }

    // Normalizar el nombre (Ej: "  CELULARES  " -> "Celulares")
    const cleanName = name.trim();
    const formattedName = cleanName.charAt(0).toUpperCase() + cleanName.slice(1).toLowerCase();

    // Verificar si ya existe (Case-insensitive)
    const existingCategory = await Category.findOne({ 
      name: { $regex: new RegExp(`^${formattedName}$`, 'i') } 
    }).lean();

    if (existingCategory) {
      // Si existe, devolvemos la existente con status 200
      return NextResponse.json({
        ...existingCategory,
        id: existingCategory._id.toString()
      }, { status: 200 });
    }

    // Crear slug más robusto (quita acentos y caracteres especiales)
    const slug = formattedName
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // Quita acentos
      .replace(/[^a-z0-9]/g, '-')     // Cambia lo que no sea letra/número por guion
      .replace(/-+/g, '-')            // Quita guiones dobles
      .replace(/^-|-$/g, '');         // Quita guiones al inicio o final

    const newCategory = await Category.create({
      name: formattedName,
      slug
    });

    // Devolvemos el objeto creado y normalizado
    return NextResponse.json({
      ...newCategory.toObject(),
      id: newCategory._id.toString()
    }, { status: 201 });

  } catch (error: any) {
    console.error("POST_CATEGORY_ERROR:", error.message);
    return NextResponse.json(
      { error: 'Error al crear la categoría' },
      { status: 500 }
    );
  }
}