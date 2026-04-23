import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import Log from '@/models/Log'; // <--- 1. IMPORTA EL MODELO DE LOG
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { email, password } = await req.json();

    const user = await User.findOne({ email: email.toLowerCase() })
      .select("+password +name +nombre")
      .lean();

    if (!user || !(await bcrypt.compare(password, user.password))) {
      // OPCIONAL: Podrías loguear intentos fallidos aquí con nivel 'warning'
      return NextResponse.json({ message: "Credenciales inválidas" }, { status: 401 });
    }

    const secret = process.env.JWT_SECRET;
    const token = jwt.sign(
      { id: user._id.toString(), email: user.email, role: user.role },
      secret!,
      { expiresIn: '24h' }
    );

    const nameFromDb = user.name || user.nombre || "";
    const cleanName = (nameFromDb.toLowerCase() === 'admin' || nameFromDb === "") 
      ? user.email.split('@')[0] 
      : nameFromDb;

    // --- 2. REGISTRO EN LA AUDITORÍA ---
    // Lo hacemos antes de enviar la respuesta al usuario
    try {
      await Log.create({
        tipo: 'AUTH_LOGIN',
        nivel: 'info',
        usuarioId: user._id.toString(),
        usuarioNombre: cleanName,
        detalles: `Inicio de sesión exitoso desde terminal web.`,
        metadata: { 
          email: user.email,
          userAgent: req.headers.get('user-agent') // Para saber desde qué navegador entró
        }
      });
    } catch (logError) {
      // Si falla el log, que no se trabe el login, solo avisamos en consola
      console.error("⚠️ No se pudo guardar el log de auditoría:", logError);
    }
    // ------------------------------------

    const response = NextResponse.json({
      message: "Login exitoso",
      token: token,
      user: {
        id: user._id.toString(),
        nombre: cleanName,
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