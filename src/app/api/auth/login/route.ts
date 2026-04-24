import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import Log from '@/models/Log'; 
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { email, password } = await req.json();

    // 1. Buscar usuario
    const user = await User.findOne({ email: email.toLowerCase() })
      .select("+password +name +nombre")
      .lean();

    // --- LOG DE INTENTO FALLIDO ---
    if (!user || !(await bcrypt.compare(password, user.password))) {
      try {
        await Log.create({
          tipo: 'AUTH_LOGIN',
          nivel: 'warning',
          usuarioNombre: email, // Usamos el email ya que no encontramos usuario válido
          detalles: `Intento de inicio de sesión fallido (Credenciales incorrectas).`,
          metadata: { email, ip: req.headers.get('x-forwarded-for') || 'unknown' }
        });
      } catch (e) {
        console.error("Error al registrar log fallido", e);
      }
      
      return NextResponse.json({ message: "Credenciales inválidas" }, { status: 401 });
    }

    // 2. Generar Token JWT
    const secret = process.env.JWT_SECRET;
    const token = jwt.sign(
      { id: user._id.toString(), email: user.email, role: user.role },
      secret!,
      { expiresIn: '24h' }
    );

    // 3. Normalizar nombre de usuario
    const nameFromDb = user.name || user.nombre || "";
    const cleanName = (nameFromDb.toLowerCase() === 'admin' || nameFromDb === "") 
      ? user.email.split('@')[0] 
      : nameFromDb;

    // --- 4. REGISTRO DE LOGIN EXITOSO EN AUDITORÍA ---
    try {
      await Log.create({
        tipo: 'AUTH_LOGIN',
        nivel: 'info',
        usuarioId: user._id.toString(),
        usuarioNombre: cleanName,
        detalles: `Inicio de sesión exitoso.`,
        metadata: { 
          email: user.email,
          userAgent: req.headers.get('user-agent'),
          location: 'Terminal Web'
        }
      });
    } catch (logError) {
      console.error("⚠️ No se pudo guardar el log de auditoría:", logError);
    }

    // 5. Preparar Respuesta
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

    // 6. Configurar Cookie
    response.cookies.set('token', token, {
      httpOnly: false, // Cambiar a true si no necesitas leerlo con JS en el cliente
      secure: process.env.NODE_ENV === 'production',
      maxAge: 86400, // 1 día
      path: '/',
    });

    return response;

  } catch (error: any) {
    console.error("❌ ERROR EN LOGIN:", error);
    return NextResponse.json({ message: "Error interno del servidor" }, { status: 500 });
  }
}