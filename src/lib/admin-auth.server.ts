// Server-side admin authentication utilities
// Never import this file from client code - it contains server-only secrets
import { scrypt, randomBytes, timingSafeEqual } from 'crypto';
import { promisify } from 'util';

const scryptAsync = promisify(scrypt);

/**
 * Hash a password using scrypt (Node.js native crypto)
 * Usage: node -e "import('./src/lib/admin-auth.server.js').then(m => m.hashPassword('your-password').then(console.log))"
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString('hex');
  const derivedKey = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${salt}:${derivedKey.toString('hex')}`;
}

/**
 * Verify a password against a stored hash
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const [salt, key] = hash.split(':');
  if (!salt || !key) return false;

  try {
    const derivedKey = (await scryptAsync(password, salt, 64)) as Buffer;
    const keyBuffer = Buffer.from(key, 'hex');
    return timingSafeEqual(derivedKey, keyBuffer);
  } catch {
    return false;
  }
}

/**
 * Get admin credentials from environment variables
 */
export function getAdminCredentials(): { username: string; passwordHash: string } | null {
  const username = process.env['ADMIN_USER'];
  const passwordHash = process.env['ADMIN_PASSWORD_HASH'];

  if (!username || !passwordHash) {
    console.warn('[Admin Auth] Missing ADMIN_USER or ADMIN_PASSWORD_HASH environment variables');
    return null;
  }

  return { username, passwordHash };
}

/**
 * Verify admin credentials
 */
export async function verifyAdminCredentials(
  username: string,
  password: string,
): Promise<boolean> {
  const credentials = getAdminCredentials();
  if (!credentials) return false;

  // Timing-safe username comparison
  const usernameMatch =
    username.length === credentials.username.length &&
    timingSafeEqual(Buffer.from(username), Buffer.from(credentials.username));

  if (!usernameMatch) {
    // Still verify password to prevent timing attacks
    await verifyPassword(password, credentials.passwordHash);
    return false;
  }

  return await verifyPassword(password, credentials.passwordHash);
}

/**
 * Simple in-memory rate limiter for brute-force protection
 */
const loginAttempts = new Map<string, { count: number; resetAt: number }>();

export function checkRateLimit(identifier: string, maxAttempts = 5, windowMs = 15 * 60 * 1000): boolean {
  const now = Date.now();
  const attempts = loginAttempts.get(identifier);

  if (!attempts || now > attempts.resetAt) {
    loginAttempts.set(identifier, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (attempts.count >= maxAttempts) {
    return false;
  }

  attempts.count++;
  return true;
}

export function resetRateLimit(identifier: string): void {
  loginAttempts.delete(identifier);
}

// Clean up old entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of loginAttempts.entries()) {
    if (now > value.resetAt) {
      loginAttempts.delete(key);
    }
  }
}, 5 * 60 * 1000); // Clean every 5 minutes
