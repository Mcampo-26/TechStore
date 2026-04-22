import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import Role from '@/models/Role';

export async function GET(request: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = 10;
    const skip = (page - 1) * limit;

    // Intentamos la búsqueda con populate
    const [usuariosRaw, total] = await Promise.all([
      User.find()
        .select('-password')
        .populate({ path: 'role', model: Role, strictPopulate: false })
        .skip(skip)
        .limit(limit)
        .lean(),
      User.countDocuments()
    ]);

    const usuarios = usuariosRaw.map((u: any) => ({
      ...u,
      role: (u.role && typeof u.role === 'object') 
        ? u.role 
        : { _id: null, name: String(u.role || "Sin Rol") }
    }));

    return NextResponse.json({ usuarios, totalPages: Math.ceil(total / limit), currentPage: page });

  } catch (error: any) {
    console.error("LOG DEL ERROR:", error.message);

    if (error.name === 'CastError' || error.message.includes('Cast to ObjectId')) {
      const fallbackUsers = await User.find().select('-password').limit(10).lean();
      const cleanedFallback = fallbackUsers.map((u: any) => ({
        ...u,
        role: { _id: null, name: String(u.role || "Formato Inválido") }
      }));
      return NextResponse.json({ 
        usuarios: cleanedFallback, 
        totalPages: 1, 
        currentPage: 1,
        warning: "Datos corruptos detectados" 
      });
    }
    return NextResponse.json({ message: "Error de servidor" }, { status: 500 });
  }
}

// --- NUEVO MÉTODO PARA REPARAR LOS USUARIOS ---
export async function PUT(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    const { _id, ...updateData } = body;

    console.log("📥 API RECEIVE - ID:", _id);
    
    // Si el rol viene como el objeto del frontend, extraemos solo el ID
    if (updateData.role && typeof updateData.role === 'object') {
      updateData.role = updateData.role._id;
    }

    const updatedUser = await User.findByIdAndUpdate(
      _id, 
      { $set: updateData }, 
      { new: true, runValidators: false } // runValidators: false permite sobreescribir el error
    ).populate('role');

    return NextResponse.json(updatedUser);
  } catch (error: any) {
    console.error("❌ ERROR AL ACTUALIZAR:", error.message);
    return NextResponse.json({ message: "No se pudo reparar el usuario" }, { status: 400 });
  }
}