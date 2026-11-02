// Client-side analytics tracking for i-Tools
// Sends anonymized usage data to the admin panel backend
// This code runs in the browser and respects user privacy (LGPD compliant)

import { createServerFn } from '@tanstack/react-start';
import { supabaseAdmin } from '@/integrations/supabase/client.server';

// Get daily salt for IP hashing (rotates daily for privacy)
function getDailySalt(): string {
  const date = new Date().toISOString().split('T')[0];
  return `i-tools-salt-${date}-${process.env.ANALYTICS_SALT || 'default-salt'}`;
}

// Hash visitor IP for anonymization using Web Crypto API
async function hashVisitorIdentifier(ip: string): Promise<string> {
  try {
    const salt = getDailySalt();
    const encoder = new TextEncoder();
    const data = encoder.encode(`${ip}${salt}`);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  } catch (err) {
    console.error('[Analytics] Hash failed:', err);
    return 'unknown';
  }
}

// Extract IP from request (Cloudflare headers first)
function getClientIP(request: Request): string {
  const cfConnectingIP = request.headers.get('cf-connecting-ip');
  const xForwardedFor = request.headers.get('x-forwarded-for');
  const xRealIP = request.headers.get('x-real-ip');
  
  return cfConnectingIP || xForwardedFor?.split(',')[0]?.trim() || xRealIP || 'unknown';
}

// Extract geo data from Cloudflare headers
function getGeoData(request: Request): { country: string | null; city: string | null } {
  return {
    country: request.headers.get('cf-ipcountry'),
    city: request.headers.get('cf-ipcity'),
  };
}

// Detect device type from user agent
function getDeviceType(userAgent: string): 'mobile' | 'tablet' | 'desktop' {
  const ua = userAgent.toLowerCase();
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobile))/i.test(ua)) {
    return 'tablet';
  }
  if (/mobile|android|iphone|ipod|blackberry|iemobile|opera mini/i.test(ua)) {
    return 'mobile';
  }
  return 'desktop';
}

export interface TrackPageViewData {
  path: string;
  toolSlug?: string;
  referrer?: string;
  sessionId?: string;
}

// Track page view (server function)
export const trackPageView = createServerFn('POST', async (data: TrackPageViewData, { request }) => {
  try {
    const ip = getClientIP(request);
    const visitorHash = hashVisitorIdentifier(ip);
    const userAgent = request.headers.get('user-agent') || '';
    const geo = getGeoData(request);

    await supabaseAdmin.from('access_events').insert({
      visitor_hash: visitorHash,
      tool_slug: data.toolSlug || null,
      page_path: data.path,
      referrer: data.referrer || null,
      user_agent: userAgent,
      country_code: geo.country,
      city: geo.city,
      device_type: getDeviceType(userAgent),
      session_id: data.sessionId || null,
      visited_at: new Date().toISOString(),
    });

    // Update online users
    await supabaseAdmin
      .from('online_users')
      .upsert({
        visitor_hash: visitorHash,
        last_heartbeat_at: new Date().toISOString(),
        page_path: data.path,
        tool_slug: data.toolSlug || null,
      });

  } catch (error) {
    console.error('[Analytics] Failed to track page view:', error);
    // Fail silently to not impact user experience
  }

  return { success: true };
});

export interface TrackUsageEventData {
  toolSlug: string;
  eventType: 'use' | 'download' | 'share' | 'error';
  metadata?: Record<string, unknown>;
}

// Track tool usage event
export const trackUsageEvent = createServerFn('POST', async (data: TrackUsageEventData, { request }) => {
  try {
    const ip = getClientIP(request);
    const visitorHash = hashVisitorIdentifier(ip);

    await supabaseAdmin.from('usage_events').insert({
      visitor_hash: visitorHash,
      tool_slug: data.toolSlug,
      event_type: data.eventType,
      metadata: data.metadata || null,
      occurred_at: new Date().toISOString(),
    });

  } catch (error) {
    console.error('[Analytics] Failed to track usage event:', error);
  }

  return { success: true };
});

export interface TrackErrorData {
  errorType: '404' | '500' | 'js_error' | 'tool_error' | 'integration_error';
  pagePath: string;
  toolSlug?: string;
  errorMessage: string;
  stackTrace?: string;
  metadata?: Record<string, unknown>;
}

// Track error
export const trackError = createServerFn('POST', async (data: TrackErrorData, { request }) => {
  try {
    const ip = getClientIP(request);
    const visitorHash = hashVisitorIdentifier(ip);
    const userAgent = request.headers.get('user-agent') || '';

    await supabaseAdmin.from('error_logs').insert({
      error_type: data.errorType,
      page_path: data.pagePath,
      tool_slug: data.toolSlug || null,
      error_message: data.errorMessage.substring(0, 1000), // Limit length
      stack_trace: data.stackTrace?.substring(0, 5000) || null,
      user_agent: userAgent,
      visitor_hash: visitorHash,
      occurred_at: new Date().toISOString(),
      metadata: data.metadata || null,
    });

  } catch (error) {
    console.error('[Analytics] Failed to track error:', error);
  }

  return { success: true };
});

// Send heartbeat to update online users
export const sendHeartbeat = createServerFn('POST', async (data: { path: string; toolSlug?: string }, { request }) => {
  try {
    const ip = getClientIP(request);
    const visitorHash = hashVisitorIdentifier(ip);

    await supabaseAdmin
      .from('online_users')
      .upsert({
        visitor_hash: visitorHash,
        last_heartbeat_at: new Date().toISOString(),
        page_path: data.path,
        tool_slug: data.toolSlug || null,
      });

  } catch (error) {
    console.error('[Analytics] Failed to send heartbeat:', error);
  }

  return { success: true };
});
