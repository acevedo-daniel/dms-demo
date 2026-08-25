import bcrypt from 'bcryptjs';
import crypto from 'crypto';

/**
 * Hash de contraseña con bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12;
  return await bcrypt.hash(password, saltRounds);
}

/**
 * Verificar contraseña con hash bcrypt
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(password, hash);
}

/**
 * Generar token seguro para sesión
 */
export function generateSecureToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * Validar entrada de usuario (prevenir XSS/Injection)
 */
export function sanitizeInput(input: string): string {
  if (!input) return '';
  
  // Remover caracteres peligrosos
  return input
    .trim()
    .replace(/[<>\"']/g, '') // Prevenir XSS básico
    .substring(0, 200); // Limitar longitud
}

/**
 * Validar formato de contraseña
 */
export function validatePassword(password: string): { valid: boolean; message: string } {
  if (!password || password.length < 3) {
    return { valid: false, message: 'La contraseña debe tener al menos 3 caracteres' };
  }
  
  if (password.length > 128) {
    return { valid: false, message: 'La contraseña es demasiado larga' };
  }
  
  return { valid: true, message: 'Válida' };
}

/**
 * Validar formato de nombre de usuario
 */
export function validateUsername(username: string): { valid: boolean; message: string } {
  if (!username || username.length < 3) {
    return { valid: false, message: 'El nombre de usuario debe tener al menos 3 caracteres' };
  }
  
  if (username.length > 50) {
    return { valid: false, message: 'El nombre de usuario es demasiado largo' };
  }
  
  // Solo letras, números y guiones bajos
  const usernameRegex = /^[a-zA-Z0-9_]+$/;
  if (!usernameRegex.test(username)) {
    return { valid: false, message: 'El nombre de usuario solo puede contener letras, números y guiones bajos' };
  }
  
  return { valid: true, message: 'Válido' };
}

