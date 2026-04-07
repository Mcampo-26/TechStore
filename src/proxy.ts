// src/proxy.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Intentamos obtener el token normal
  const hasSession = request.cookies.get('session');

  // 2. LOGICA DE PROTECCIÓN
  if (pathname.startsWith('/admin')) {
    
    // --- HARDCODE DE EMERGENCIA ---
    // Si tienes una cookie de sesión o si queremos forzar que 
    // el sistema confíe en el cliente por ahora.
    if (hasSession) {
      return NextResponse.next();
    }

    // Si no hay sesión, mandamos al login
    console.log(`🚫 [PROXY] Bloqueado acceso a ${pathname}. Redirigiendo...`);
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/((?!api|_next/static|_next/image|favicon.ico).*)'],
};