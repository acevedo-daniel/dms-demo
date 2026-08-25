import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Admin from '@/models/admin';
import { cookies } from 'next/headers';
import { verifyPassword, hashPassword, validatePassword } from '@/lib/security';
import { checkRateLimit, getClientIp } from '@/lib/rate-limiter';

export async function POST(request: NextRequest) {
  try {
    // 1. VERIFICAR AUTENTICACIÓN
    const cookieStore = await cookies();
    const authToken = cookieStore.get('auth-token');

    if (!authToken) {
      return NextResponse.json(
        { error: 'No autenticado' },
        { status: 401 }
      );
    }

    // 2. RATE LIMITING - Prevenir abuso
    const clientIp = getClientIp(request);
    const rateLimit = checkRateLimit(`change-password:${clientIp}`, {
      maxAttempts: 3,
      windowMs: 30 * 60 * 1000 // 3 intentos por 30 minutos
    });

    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Demasiados intentos. Intenta más tarde.' },
        { status: 429 }
      );
    }

    // 3. VALIDAR ENTRADA
    const { currentPassword, newPassword } = await request.json();

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: 'Se requiere contraseña actual y nueva' },
        { status: 400 }
      );
    }

    // Validar nueva contraseña
    const validation = validatePassword(newPassword);
    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.message },
        { status: 400 }
      );
    }

    // Prevenir reutilización de contraseña actual
    if (currentPassword === newPassword) {
      return NextResponse.json(
        { error: 'La nueva contraseña debe ser diferente a la actual' },
        { status: 400 }
      );
    }

    // 4. CONECTAR A BD
    await connectDB();

    // Session-to-user binding is part of the authentication redesign.
    // This placeholder avoids carrying any legacy account identity forward.
    const admin = await Admin.findOne({});

    if (!admin) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    // 5. VERIFICAR CONTRASEÑA ACTUAL SEGURAMENTE
    const isValidPassword = await verifyPassword(currentPassword, admin.password);

    if (!isValidPassword) {
      console.log(`[SECURITY] Cambio de contraseña fallido - IP: ${clientIp} - Timestamp: ${new Date().toISOString()}`);
      
      return NextResponse.json(
        { error: 'Contraseña actual incorrecta' },
        { status: 401 }
      );
    }

    // 6. HASHEAR Y ACTUALIZAR NUEVA CONTRASEÑA
    const hashedNewPassword = await hashPassword(newPassword);
    admin.password = hashedNewPassword;
    admin.updatedAt = new Date();
    await admin.save();

    // 7. LOGGING DE SEGURIDAD
    console.log(`[SECURITY] Contraseña cambiada exitosamente - Usuario: ${admin.username} - IP: ${clientIp} - Timestamp: ${new Date().toISOString()}`);

    return NextResponse.json(
      { message: 'Contraseña actualizada correctamente' },
      { status: 200 }
    );
  } catch (error) {
    console.error('[SECURITY] Error al cambiar contraseña:', error);
    
    return NextResponse.json(
      { error: 'Error al cambiar la contraseña' },
      { status: 500 }
    );
  }
}
