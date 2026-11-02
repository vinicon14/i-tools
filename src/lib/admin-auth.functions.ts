// Admin authentication with Web Crypto (Cloudflare Workers safe)
import { createServerFn } from '@tanstack/react-start';

// PBKDF2 parameters (Web Crypto API)
const PBKDF2_ITERATIONS = 100000;
const HASH_LENGTH = 32;
const SALT_LENGTH = 16;

// Rate limiting (in-memory, per-worker)
const loginAttempts = new Map<string, { count: number; resetAt: number }>();
const MAX_ATTEMPTS = 5;
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes

/**
 * Hash password with PBKDF2 (Web Crypto API)
 * Format: pbkdf2:iterations:salt:hash (all hex-encoded)
 */
export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const salt = crypto.getRandomValues(new Uint8Array(SALT_LENGTH));
  
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    'PBKDF2',
    false,
    ['deriveBits']
  );

  const hashBuffer = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt,
      iterations: PBKDF2_ITERATIONS,
      hash: 'SHA-256'
    },
    keyMaterial,
    HASH_LENGTH * 8
  );

  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  const saltHex = Array.from(salt).map(b => b.toString(16).padStart(2, '0')).join('');

  return `pbkdf2:${PBKDF2_ITERATIONS}:${saltHex}:${hashHex}`;
}

/**
 * Verify password against stored hash (timing-safe comparison)
 */
export async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
  try {
    const [algo, iterStr, saltHex, expectedHashHex] = storedHash.split(':');
    
    if (algo !== 'pbkdf2') return false;
    
    const iterations = parseInt(iterStr, 10);
    const salt = new Uint8Array(saltHex.match(/.{2}/g)!.map(b => parseInt(b, 16)));
    
    const encoder = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      encoder.encode(password),
      'PBKDF2',
      false,
      ['deriveBits']
    );

    const hashBuffer = await crypto.subtle.deriveBits(
      {
        name: 'PBKDF2',
        salt,
        iterations,
        hash: 'SHA-256'
      },
      keyMaterial,
      HASH_LENGTH * 8
    );

    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const actualHashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    // Timing-safe comparison
    return timingSafeEqual(actualHashHex, expectedHashHex);
  } catch (err) {
    console.error('[Auth] Password verification failed:', err);
    return false;
  }
}

/**
 * Timing-safe string comparison (Web Crypto API)
 */
function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

/**
 * Check rate limit for IP
 */
function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const attempt = loginAttempts.get(ip);

  if (!attempt || now > attempt.resetAt) {
    loginAttempts.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }

  if (attempt.count >= MAX_ATTEMPTS) {
    return false;
  }

  attempt.count++;
  return true;
}

/**
 * Reset rate limit for IP (on successful login)
 */
function resetRateLimit(ip: string): void {
  loginAttempts.delete(ip);
}

/**
 * Get client IP from request
 */
function getClientIP(request: Request): string {
  return (
    request.headers.get('cf-connecting-ip') ||
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown'
  );
}

/**
 * Check if admin is configured
 */
export const isAdminConfigured = createServerFn({ method: 'GET' }).handler(() => {
  const password = process.env['ADMIN_PASSWORD_HASH'];
  return !!password;
});

/**
 * Admin login (server function)
 */
export const adminLogin = createServerFn({ method: 'POST' }).handler(async ({ data, request }: { data: { password: string }; request: Request }) => {
  const storedHash = process.env['ADMIN_PASSWORD_HASH'];
  
  if (!storedHash) {
    return { success: false, error: 'Admin panel not configured' };
  }

  const ip = getClientIP(request);
  
  if (!checkRateLimit(ip)) {
    return { success: false, error: 'Too many failed attempts. Try again in 15 minutes.' };
  }

  const isValid = await verifyPassword(data.password, storedHash);

  if (!isValid) {
    return { success: false, error: 'Invalid password' };
  }

  resetRateLimit(ip);

  // Generate secure session token
  const sessionToken = Array.from(crypto.getRandomValues(new Uint8Array(32)))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');

  // Set HttpOnly/Secure/SameSite cookie (expires in 8 hours)
  const expires = new Date(Date.now() + 8 * 60 * 60 * 1000);
  
  return new Response(
    JSON.stringify({ success: true }),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Set-Cookie': `admin_session=${sessionToken}; Path=/adm; HttpOnly; Secure; SameSite=Strict; Expires=${expires.toUTCString()}`
      }
    }
  );
});

/**
 * Verify admin session (middleware for admin routes)
 */
export const verifyAdminSession = createServerFn({ method: 'GET' }).handler(async ({ request }: { request: Request }) => {
  const storedHash = process.env['ADMIN_PASSWORD_HASH'];
  
  if (!storedHash) {
    return { authenticated: false, reason: 'not_configured' };
  }

  const cookie = request.headers.get('cookie') || '';
  const sessionMatch = cookie.match(/admin_session=([^;]+)/);
  
  if (!sessionMatch) {
    return { authenticated: false, reason: 'no_session' };
  }

  // Simple session validation (token exists)
  // In production, store sessions in KV or database with expiry
  return { authenticated: true };
});

/**
 * Admin logout
 */
export const adminLogout = createServerFn({ method: 'POST' }).handler(() => {
  return new Response(
    JSON.stringify({ success: true }),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Set-Cookie': 'admin_session=; Path=/adm; HttpOnly; Secure; SameSite=Strict; Max-Age=0'
      }
    }
  );
});
