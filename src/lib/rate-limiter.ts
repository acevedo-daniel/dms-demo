/**
 * Rate limiter simple para prevenir ataques de fuerza bruta
 * En producción, usar Redis o similar
 */

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

// Almacenamiento en memoria (en producción usar Redis)
const rateLimitStore = new Map<string, RateLimitEntry>();

// Limpiar entradas antiguas cada 15 minutos
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (now > entry.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}, 15 * 60 * 1000);

export interface RateLimitConfig {
  maxAttempts: number;
  windowMs: number; // ventana de tiempo en milisegundos
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetTime: number;
}

/**
 * Verificar límite de intentos por IP
 */
export function checkRateLimit(
  identifier: string,
  config: RateLimitConfig = { maxAttempts: 5, windowMs: 15 * 60 * 1000 } // 5 intentos por 15 minutos
): RateLimitResult {
  const now = Date.now();
  const entry = rateLimitStore.get(identifier);

  // Si no hay entrada o expiró, crear nueva
  if (!entry || now > entry.resetTime) {
    const resetTime = now + config.windowMs;
    rateLimitStore.set(identifier, { count: 1, resetTime });
    return {
      allowed: true,
      remaining: config.maxAttempts - 1,
      resetTime
    };
  }

  // Si excede el límite
  if (entry.count >= config.maxAttempts) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: entry.resetTime
    };
  }

  // Incrementar contador
  entry.count++;
  rateLimitStore.set(identifier, entry);

  return {
    allowed: true,
    remaining: config.maxAttempts - entry.count,
    resetTime: entry.resetTime
  };
}

/**
 * Resetear límite para un identificador (útil después de login exitoso)
 */
export function resetRateLimit(identifier: string): void {
  rateLimitStore.delete(identifier);
}

/**
 * Obtener IP del request
 */
export function getClientIp(request: Request): string {
  // Intentar obtener IP real detrás de proxies
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  
  if (realIp) {
    return realIp;
  }
  
  return 'unknown';
}

