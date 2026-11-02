// Browser-side analytics tracking (LGPD-compliant, fail-safe)
import { createServerFn } from '@tanstack/react-start';
import { getSupabaseAdmin } from '@/integrations/supabase/client.server';

function getDailySalt(): string {
  const date = new Date().toISOString().split('T')[0];
  const salt = process.env['ANALYTICS_SALT'] || 'default-daily-salt';
  return `${date}-${salt}`;
}

async function hashVisitorIP(ip: string): Promise<string> {
  try {
    const salt = getDailySalt();
    const encoder = new TextEncoder();
    const data = encoder.encode(`${ip}${salt}`);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  } catch (err) {
    return 'unknown';
  }
}

function extractDomain(url: string | null): string | null {
  if (!url) return null;
  try {
    return new URL(url).hostname;
  } catch {
    return null;
  }
}

function detectUACategory(ua: string): string {
  const lower = ua.toLowerCase();
  if (/(bot|crawler|spider)/i.test(lower)) return 'bot';
  if (/(mobile|android|iphone|ipad)/i.test(lower)) return 'mobile';
  return 'desktop';
}

export const trackToolUsage = createServerFn({ method: 'POST' }).handler(async ({
  data,
  request
}: {
  data: { toolSlug: string; language?: string };
  request: Request;
}) => {
  try {
    const supabase = getSupabaseAdmin();
    if (!supabase) return { success: true, reason: 'disabled' };

    const ip = request.headers.get('cf-connecting-ip') || 
               request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 
               'unknown';
    const countryCode = request.headers.get('cf-ipcountry') || null;
    const referrer = request.headers.get('referer');
    const ua = request.headers.get('user-agent') || '';

    const visitorHash = await hashVisitorIP(ip);

    await supabase.from('analytics_events').insert({
      tool_slug: data.toolSlug,
      visitor_hash: visitorHash,
      country_code: countryCode,
      language: data.language || null,
      referrer_domain: extractDomain(referrer),
      user_agent_category: detectUACategory(ua)
    });

    return { success: true };
  } catch (err) {
    console.error('[Analytics]', err);
    return { success: true, reason: 'error_caught' };
  }
});

export const isAnalyticsEnabled = createServerFn({ method: 'GET' }).handler(() => {
  return !!getSupabaseAdmin();
});
