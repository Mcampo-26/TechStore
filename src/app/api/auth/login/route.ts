import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
    try {
      await dbConnect();
      const { email, password } = await req.json();
  
      // Buscamos al usuario y traemos explícitamente el carrito
      const user = await User.findOne({ email: email.toLowerCase() }).select("+password");
  
      if (!user || !(await bcrypt.compare(password, user.password))) {
        return NextResponse.json({ message: "Credenciales inválidas" }, { status: 401 });
      }
  
      // LOGS DE CONTROL EN CONSOLA DEL SERVIDOR (Terminal)
      console.log("-----------------------------------------");
      console.log("✅ LOGIN EXITOSO:", user.email);
      console.log("📦 ENVIANDO CARRITO AL FRONT:", user.cart?.length || 0, "productos");
      console.log("-----------------------------------------");
  
      return NextResponse.json({
        message: "Login exitoso",
        user: {
          id: user._id.toString(), // Convertimos ObjectId a String para evitar errores en el front
          name: user.name,
          email: user.email,
          role: user.role,
          cart: user.cart || [] // Enviamos el array tal cual está en Mongo
        }
      }, { status: 200 });
  
    } catch (error: any) {
      console.error("LOGIN_ERROR:", error);
      return NextResponse.json({ message: "Error interno del servidor" }, { status: 500 });
    }
}