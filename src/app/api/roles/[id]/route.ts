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

    let usuariosRaw;
    let total;

    try {
      // Intentamos el populate. Si falla por el valor "user", atrapamos el error.
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
      // MODO EMERGENCIA: Si hay error de "Cast to ObjectId", cargamos sin populate
      console.log("⚠️ Saltando error de validación en la DB...");
      [usuariosRaw, total] = await Promise.all([
        User.find().select('-password').skip(skip).limit(limit).lean(),
        User.countDocuments()
      ]);
    }

    // NORMALIZACIÓN: Si el rol es un string (como "user"), lo convertimos en objeto
    // para que el frontend no de error al buscar 'u.role.name'
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

// Para actualizar y limpiar el dato corrupto
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  await dbConnect();
  try {
    const { id } = await params;
    const body = await req.json();
    
    // Al actualizar desde aquí, convertiremos el string "user" en un ObjectId real
    const updatedUser = await User.findByIdAndUpdate(id, body, { new: true })
      .populate('role');
      
    return NextResponse.json(updatedUser);
  } catch (error) {
    return NextResponse.json({ message: "Error al actualizar" }, { status: 400 });
  }
}