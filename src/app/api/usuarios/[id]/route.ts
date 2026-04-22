import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import Role from '@/models/Role';

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;
    const body = await req.json();

    // LOG 1: Ver qué llega del frontend
    console.log("📥 API RECEIVE - ID:", id);
    console.log("📥 API RECEIVE - BODY:", JSON.stringify(body, null, 2));

    // Limpieza de Rol
    if (body.role && typeof body.role === 'object') {
      console.log("🔄 Transformando objeto de rol a ID:", body.role._id);
      body.role = body.role._id;
    }

    // LOG 2: Ver qué vamos a mandar a MongoDB
    console.log("📤 MONGO UPDATE START - Data:", body);

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $set: body },
      { 
        returnDocument: 'after', 
        runValidators: true 
      }
    ).populate('role');

    if (!updatedUser) {
      console.log("❌ MONGO UPDATE FAIL - Usuario no encontrado");
      return NextResponse.json({ message: "Usuario no encontrado" }, { status: 404 });
    }

    // LOG 3: Ver qué devolvió Mongo
    console.log("✅ MONGO UPDATE SUCCESS - Resultado:", updatedUser.nombre, "Rol:", updatedUser.role?.name);

    return NextResponse.json(updatedUser);
  } catch (error: any) {
    console.error("🔥 API ERROR:", error);
    return NextResponse.json({ message: "Error interno" }, { status: 500 });
  }
}