// Server-side session management for admin panel
import { randomBytes } from 'crypto';

export interface AdminSession {
  id: string;
  username: string;
  createdAt: number;
  expiresAt: number;
  lastActivity: number;
}

// In-memory session store (for production, use Redis or database)
const sessions = new Map<string, AdminSession>();

const SESSION_DURATION = 4 * 60 * 60 * 1000; // 4 hours
const SESSION_COOKIE_NAME = 'admin_session';

export function createSession(username: string): AdminSession {
  const sessionId = randomBytes(32).toString('hex');
  const now = Date.now();

  const session: AdminSession = {
    id: sessionId,
    username,
    createdAt: now,
    expiresAt: now + SESSION_DURATION,
    lastActivity: now,
  };

  sessions.set(sessionId, session);
  return session;
}

export function getSession(sessionId: string): AdminSession | null {
  const session = sessions.get(sessionId);
  if (!session) return null;

  const now = Date.now();
  if (now > session.expiresAt) {
    sessions.delete(sessionId);
    return null;
  }

  // Update last activity
  session.lastActivity = now;
  return session;
}

export function deleteSession(sessionId: string): void {
  sessions.delete(sessionId);
}

export function getSessionFromCookie(cookieHeader: string | null): AdminSession | null {
  if (!cookieHeader) return null;

  const cookies = parseCookies(cookieHeader);
  const sessionId = cookies[SESSION_COOKIE_NAME];
  if (!sessionId) return null;

  return getSession(sessionId);
}

export function setSessionCookie(sessionId: string): string {
  const maxAge = SESSION_DURATION / 1000; // Convert to seconds
  return `${SESSION_COOKIE_NAME}=${sessionId}; HttpOnly; Secure; SameSite=Strict; Max-Age=${maxAge}; Path=/adm`;
}

export function clearSessionCookie(): string {
  return `${SESSION_COOKIE_NAME}=; HttpOnly; Secure; SameSite=Strict; Max-Age=0; Path=/adm`;
}

function parseCookies(cookieHeader: string): Record<string, string> {
  return Object.fromEntries(
    cookieHeader.split(';').map((cookie) => {
      const [key, ...rest] = cookie.split('=');
      return [key?.trim() || '', rest.join('=').trim()];
    }),
  );
}

// Clean up expired sessions periodically
setInterval(() => {
  const now = Date.now();
  for (const [sessionId, session] of sessions.entries()) {
    if (now > session.expiresAt) {
      sessions.delete(sessionId);
    }
  }
}, 10 * 60 * 1000); // Clean every 10 minutes

// Generate CSRF token
export function generateCsrfToken(): string {
  return randomBytes(32).toString('hex');
}

export function validateCsrfToken(token: string, expectedToken: string): boolean {
  if (!token || !expectedToken) return false;
  return token === expectedToken;
}
