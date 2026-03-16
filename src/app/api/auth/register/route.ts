import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb'; 
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  try {
    await dbConnect();
    
    const { name, email, password } = await req.json();

    // Validaciones básicas de servidor
    if (!name || !email || !password) {
      return NextResponse.json({ message: "Todos los campos son obligatorios" }, { status: 400 });
    }

    // Normalizar email y verificar existencia
    const normalizedEmail = email.toLowerCase();
    const existingUser = await User.findOne({ email: normalizedEmail });
    
    if (existingUser) {
      return NextResponse.json({ message: "Este correo ya está registrado" }, { status: 400 });
    }

    // Encriptación de seguridad
    const hashedPassword = await bcrypt.hash(password, 10);

    // Creación del nuevo perfil
    const user = await User.create({
      name,
      email: normalizedEmail,
      password: hashedPassword,
      role: 'user',
      cart: [] // Inicializamos el carrito vacío en DB
    });

    console.log("-----------------------------------------");
    console.log("🚀 NUEVO USUARIO REGISTRADO:", user.email);
    console.log("-----------------------------------------");

    // Devolvemos el usuario con el ID normalizado para el Store
    return NextResponse.json({ 
      message: "Usuario creado con éxito",
      user: { 
        id: user._id.toString(), 
        name: user.name, 
        email: user.email, 
        role: user.role,
        cart: []
      } 
    }, { status: 201 });

  } catch (error: any) {
    console.error("REGISTER_API_ERROR:", error);
    return NextResponse.json({ message: "Error interno al procesar el registro" }, { status: 500 });
  }
}