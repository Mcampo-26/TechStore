import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { email, password } = await req.json();

    // 1. BUSQUEDA FORZADA: 
    // Añadimos .lean() para que nos dé un objeto JS puro y no filtre campos del esquema.
    // Añadimos .select("+name +nombre") para obligar a traer esos campos.
    const user = await User.findOne({ email: email.toLowerCase() })
      .select("+password +name +nombre")
      .lean();

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return NextResponse.json({ message: "Credenciales inválidas" }, { status: 401 });
    }

    const secret = process.env.JWT_SECRET;
    const token = jwt.sign(
      { id: user._id.toString(), email: user.email, role: user.role },
      secret!,
      { expiresIn: '24h' }
    );

    // 2. LÓGICA DE DETECCIÓN (Ahora con los datos que vimos en tu log)
    // Tu log dice que el campo es "name": "Raul"
    const nameFromDb = user.name || user.nombre || "";
    
    // Si el nombre es "admin" o está vacío, usamos el email. Si no, usamos el nombre real.
    const cleanName = (nameFromDb.toLowerCase() === 'admin' || nameFromDb === "") 
      ? user.email.split('@')[0] 
      : nameFromDb;

    console.log("-----------------------------------------");
    console.log(`✅ LOGIN EXITOSO: ${user.email}`);
    console.log(`📝 NOMBRE RECUPERADO DE DB: "${nameFromDb}"`);
    console.log(`✨ ENVIANDO AL FRONTEND: "${cleanName}"`);
    console.log("-----------------------------------------");

    const response = NextResponse.json({
      message: "Login exitoso",
      token: token,
      user: {
        id: user._id.toString(),
        nombre: cleanName, // Este es el que recibe Zustand
        email: user.email,
        role: user.role,
        cart: user.cart || []
      }
    }, { status: 200 });

    response.cookies.set('token', token, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 86400,
      path: '/',
    });

    return response;

  } catch (error: any) {
    console.error("❌ ERROR EN LOGIN:", error);
    return NextResponse.json({ message: "Error interno" }, { status: 500 });
  }
}