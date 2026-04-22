import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Next.js ahora busca específicamente el nombre "proxy" o un export default
export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. EVITAR BUCLES Y PROTEGER LA API
  // Importante: No interceptar llamadas a /api para que los datos carguen
  if (pathname.startsWith('/api')) {
    return NextResponse.next();
  }

  // 2. OBTENER TOKEN
  // Ajusta 'token' al nombre que uses en tus cookies
  const token = request.cookies.get('token');

  // 3. PROTECCIÓN DE RUTA ADMIN
  if (pathname.startsWith('/admin')) {
    if (!token) {
      console.log(`🚫 [PROXY] Acceso denegado a ${pathname}. Redirigiendo...`);
      const loginUrl = new URL('/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

// El matcher define qué rutas escucha este archivo
export const config = {
  matcher: [
    '/admin/:path*',
    '/api/:path*', // Lo incluimos en el matcher pero lo saltamos en el IF de arriba
  ],
};