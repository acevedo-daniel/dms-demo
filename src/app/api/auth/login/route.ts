import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Admin from '@/models/admin';
import { cookies } from 'next/headers';
import { verifyPassword, hashPassword, sanitizeInput, validateUsername, validatePassword, generateSecureToken } from '@/lib/security';
import { checkRateLimit, resetRateLimit, getClientIp } from '@/lib/rate-limiter';

export async function POST(request: NextRequest) {
  try {
    // 1. RATE LIMITING - Prevenir fuerza bruta (OWASP A07:2021)
    const clientIp = getClientIp(request);
    const rateLimit = checkRateLimit(`login:${clientIp}`, {
      maxAttempts: 5,
      windowMs: 15 * 60 * 1000 // 5 intentos por 15 minutos
    });

    if (!rateLimit.allowed) {
      const resetTime = new Date(rateLimit.resetTime).toLocaleTimeString('es-AR');
      return NextResponse.json(
        { 
          error: `Demasiados intentos de login. Intenta nuevamente después de las ${resetTime}` 
        },
        { 
          status: 429,
          headers: {
            'Retry-After': Math.ceil((rateLimit.resetTime - Date.now()) / 1000).toString()
          }
        }
      );
    }

    // 2. VALIDACIÓN DE ENTRADA (OWASP A03:2021 - Injection)
    const body = await request.json();
    let { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Usuario y contraseña son requeridos' },
        { status: 400 }
      );
    }

    // Sanitizar entrada
    username = sanitizeInput(username);

    // Validar formato
    const usernameValidation = validateUsername(username);
    if (!usernameValidation.valid) {
      return NextResponse.json(
        { error: usernameValidation.message },
        { status: 400 }
      );
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      return NextResponse.json(
        { error: passwordValidation.message },
        { status: 400 }
      );
    }

    // 3. CONEXIÓN A BASE DE DATOS
    await connectDB();

    const admin = await Admin.findOne({ username });

    if (!admin) {
      return NextResponse.json(
        { error: 'Credenciales inválidas' },
        { status: 401 }
      );
    }

    // 4. VERIFICACIÓN SEGURA DE CONTRASEÑAS (OWASP A02:2021 - Cryptographic Failures)
    let isValidPassword = false;
    
    // Intentar verificar con bcrypt primero
    try {
      isValidPassword = await verifyPassword(password, admin.password);
    } catch (error) {
      // Si falla (contraseña no hasheada), comparar directamente
      isValidPassword = password === admin.password;
      
      // Si la contraseña es correcta pero está en texto plano, actualizarla a hasheada
      if (isValidPassword) {
        console.log('[SECURITY] Migrando contraseña de texto plano a hash bcrypt...');
        admin.password = await hashPassword(password);
        admin.updatedAt = new Date();
        await admin.save();
        console.log('[SECURITY] Contraseña migrada exitosamente');
      }
    }

    if (username === admin.username && isValidPassword) {
      // Login exitoso - resetear rate limit
      resetRateLimit(`login:${clientIp}`);

      // 5. CREAR SESIÓN SEGURA
      const secureToken = generateSecureToken();
      const cookieStore = await cookies();
      
      cookieStore.set('auth-token', secureToken, {
        httpOnly: true, // Previene acceso desde JavaScript (XSS)
        secure: process.env.NODE_ENV === 'production', // Solo HTTPS en producción
        sameSite: 'strict', // Previene CSRF
        maxAge: 60 * 60 * 24 * 7, // 7 días
        path: '/' // Disponible en toda la app
      });

      // 6. LOGGING DE EVENTOS DE SEGURIDAD
      console.log(`[SECURITY] Login exitoso - Usuario: ${username} - IP: ${clientIp} - Timestamp: ${new Date().toISOString()}`);

      return NextResponse.json(
        { 
          message: 'Login exitoso', 
          username: admin.username 
        },
        { status: 200 }
      );
    } else {
      // 7. RESPUESTA GENÉRICA (no revelar si usuario o contraseña es incorrecta)
      console.log(`[SECURITY] Login fallido - Usuario intentado: ${username} - IP: ${clientIp} - Timestamp: ${new Date().toISOString()}`);
      
      return NextResponse.json(
        { error: 'Credenciales inválidas' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('[SECURITY] Error en login:', error);
    
    // No revelar detalles del error al cliente
    return NextResponse.json(
      { error: 'Error al iniciar sesión' },
      { status: 500 }
    );
  }
}
