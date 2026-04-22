import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import Role from '@/models/Role';

// Definimos la interfaz para los parámetros asíncronos de Next.js 15
interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(request: Request) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = 10;
    const skip = (page - 1) * limit;

    let usuariosRaw;
    let total;

    try {
      [usuariosRaw, total] = await Promise.all([
        User.find()
          .select('-password')
          .populate({
            path: 'role',
            model: Role,
            strictPopulate: false 
          })
          .skip(skip)
          .limit(limit)
          .lean(),
        User.countDocuments()
      ]);
    } catch (err: any) {
      console.log("⚠️ Saltando error de validación en la DB...");
      [usuariosRaw, total] = await Promise.all([
        User.find().select('-password').skip(skip).limit(limit).lean(),
        User.countDocuments()
      ]);
    }

    const usuarios = usuariosRaw.map((u: any) => ({
      ...u,
      role: (u.role && typeof u.role === 'object') 
        ? u.role 
        : { _id: null, name: String(u.role || "Dato Corrupto") }
    }));

    return NextResponse.json({
      usuarios,
      totalPages: Math.ceil(total / limit),
      currentPage: page
    });

  } catch (error: any) {
    console.error("❌ ERROR CRÍTICO:", error.message);
    return NextResponse.json({ message: "Error interno" }, { status: 500 });
  }
}

// CORRECCIÓN EN EL PUT PARA NEXT.JS 15
export async function PUT(req: Request, context: RouteContext) {
  try {
    await dbConnect();
    
    // 1. ESPERAR A LOS PARAMS (Obligatorio en Next 15)
    const { id } = await context.params;
    
    const body = await req.json();
    
    // 2. Limpieza de datos: Si el body trae un rol vacío o string "user", 
    // podrías manejarlo aquí antes de guardar.
    const updatedUser = await User.findByIdAndUpdate(id, body, { 
      new: true,
      runValidators: true 
    }).populate('role');
    
    if (!updatedUser) {
      return NextResponse.json({ message: "Usuario no encontrado" }, { status: 404 });
    }
      
    return NextResponse.json(updatedUser);
  } catch (error: any) {
    console.error("❌ ERROR AL ACTUALIZAR USUARIO:", error.message);
    return NextResponse.json({ message: "Error al actualizar", error: error.message }, { status: 400 });
  }
}

// Opcional: Si tienes DELETE en este mismo archivo, también debe usar RouteContext
export async function DELETE(req: Request, context: RouteContext) {
  try {
    await dbConnect();
    const { id } = await context.params;
    await User.findByIdAndDelete(id);
    return NextResponse.json({ message: "Usuario eliminado" });
  } catch (error) {
    return NextResponse.json({ message: "Error al eliminar" }, { status: 500 });
  }
}