import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const authToken = request.cookies.get('auth-token');
  const { pathname } = request.nextUrl;

  // Crear respuesta
  const response = NextResponse.next();

  // ===== ENCABEZADOS DE SEGURIDAD (OWASP) =====
  
  // 1. Content Security Policy (CSP) - Previene XSS
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-eval' 'unsafe-inline'; " + // Next.js requiere unsafe-eval en dev
    "style-src 'self' 'unsafe-inline'; " +
    "img-src 'self' data: https:; " +
    "font-src 'self' data:; " +
    "connect-src 'self'; " +
    "frame-src 'self' https://www.google.com https://maps.google.com; " + // Permitir iframes de Google Maps
    "frame-ancestors 'none'; " +
    "base-uri 'self'; " +
    "form-action 'self';"
  );

  // 2. X-Frame-Options - Previene Clickjacking
  response.headers.set('X-Frame-Options', 'DENY');

  // 3. X-Content-Type-Options - Previene MIME sniffing
  response.headers.set('X-Content-Type-Options', 'nosniff');

  // 4. Referrer-Policy - Control de información de referrer
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  // 5. X-XSS-Protection - Protección XSS legacy browsers
  response.headers.set('X-XSS-Protection', '1; mode=block');

  // 6. Permissions-Policy - Control de características del navegador
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(), interest-cohort=()'
  );

  // 7. Strict-Transport-Security (HSTS) - Solo en producción con HTTPS
  if (process.env.NODE_ENV === 'production') {
    response.headers.set(
      'Strict-Transport-Security',
      'max-age=31536000; includeSubDomains; preload'
    );
  }

  // 8. Cache-Control para páginas sensibles
  if (pathname.startsWith('/admin') || pathname === '/login') {
    response.headers.set(
      'Cache-Control',
      'no-store, no-cache, must-revalidate, private'
    );
  }

  // ===== LÓGICA DE AUTENTICACIÓN =====

  // Rutas que requieren autenticación
  const protectedRoutes = ['/admin'];

  // Verificar si la ruta actual está protegida
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  );

  // Si es una ruta protegida y no hay token, redirigir al login
  if (isProtectedRoute && !authToken) {
    const loginUrl = new URL('/login', request.url);
    const redirectResponse = NextResponse.redirect(loginUrl);
    
    // Copiar encabezados de seguridad a la respuesta de redirección
    response.headers.forEach((value, key) => {
      redirectResponse.headers.set(key, value);
    });
    
    return redirectResponse;
  }

  // Si está en login y ya está autenticado, redirigir al panel
  if (pathname === '/login' && authToken) {
    const panelUrl = new URL('/admin/panel', request.url);
    const redirectResponse = NextResponse.redirect(panelUrl);
    
    // Copiar encabezados de seguridad
    response.headers.forEach((value, key) => {
      redirectResponse.headers.set(key, value);
    });
    
    return redirectResponse;
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ]
};
