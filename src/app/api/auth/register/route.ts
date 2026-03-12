import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb'; // Nota: Tu archivo se llama mongodb.ts según la foto
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  try {
    await dbConnect();
    
    const { name, email, password } = await req.json();

    // Validaciones básicas
    if (!name || !email || !password) {
      return NextResponse.json({ message: "Todos los campos son obligatorios" }, { status: 400 });
    }

    // Verificar si ya existe
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: "El usuario ya existe" }, { status: 400 });
    }

    // Encriptar
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: 'user'
    });

    return NextResponse.json({ 
      user: { id: user._id, name: user.name, email: user.email, role: user.role } 
    }, { status: 201 });

  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ message: "Error interno en la API" }, { status: 500 });
  }
}