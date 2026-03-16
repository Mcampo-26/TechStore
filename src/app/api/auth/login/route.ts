import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
    try {
      await dbConnect();
      const { email, password } = await req.json();
  
      // Buscamos al usuario y traemos la contraseña (que suele estar oculta por defecto)
      const user = await User.findOne({ email: email.toLowerCase() }).select("+password");
  
      if (!user || !(await bcrypt.compare(password, user.password))) {
        return NextResponse.json({ message: "Credenciales inválidas" }, { status: 401 });
      }
  
      console.log("-----------------------------------------");
      console.log("✅ LOGIN EXITOSO:", user.email);
      console.log("📦 ENVIANDO CARRITO AL FRONT:", user.cart?.length || 0, "productos");
      console.log("-----------------------------------------");
  
      // Devolvemos el objeto normalizado
      return NextResponse.json({
        message: "Login exitoso",
        user: {
          id: user._id.toString(), 
          name: user.name,
          email: user.email,
          role: user.role,
          cart: user.cart || [] 
        }
      }, { status: 200 });
  
    } catch (error: any) {
      console.error("LOGIN_ERROR:", error);
      return NextResponse.json({ message: "Error interno del servidor" }, { status: 500 });
    }
}