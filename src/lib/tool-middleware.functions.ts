// Middleware to check if a tool is enabled with caching
// Returns 404 if tool is disabled by admin
// Uses in-memory cache with 5-minute TTL to avoid database hits on every request

import { createServerFn } from '@tanstack/react-start';
import { supabaseAdmin } from '@/integrations/supabase/client.server';

interface CacheEntry {
  enabled: boolean;
  expiresAt: number;
}

// In-memory cache with 5-minute TTL
const toolEnabledCache = new Map<string, CacheEntry>();
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

// Clean up expired cache entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of toolEnabledCache.entries()) {
    if (now > entry.expiresAt) {
      toolEnabledCache.delete(key);
    }
  }
}, 60 * 1000); // Clean every minute

export const isToolEnabled = createServerFn('GET', async (toolSlug: string) => {
  // Check cache first
  const cached = toolEnabledCache.get(toolSlug);
  if (cached && Date.now() < cached.expiresAt) {
    return cached.enabled;
  }

  try {
    const { data } = await supabaseAdmin
      .from('tool_config')
      .select('is_enabled')
      .eq('tool_slug', toolSlug)
      .single();

    // If no config exists, tool is enabled by default
    const enabled = data?.is_enabled ?? true;

    // Cache the result
    toolEnabledCache.set(toolSlug, {
      enabled,
      expiresAt: Date.now() + CACHE_TTL_MS,
    });

    return enabled;
  } catch (error) {
    // On error, allow access (fail open for better UX)
    console.error('[Tool Config] Error checking if tool is enabled:', error);
    
    // Cache the default (enabled) result even on error to avoid repeated failed queries
    toolEnabledCache.set(toolSlug, {
      enabled: true,
      expiresAt: Date.now() + CACHE_TTL_MS,
    });
    
    return true;
  }
});

// Clear cache for a specific tool (called when admin changes tool state)
export const clearToolCache = createServerFn('POST', async (toolSlug: string) => {
  toolEnabledCache.delete(toolSlug);
  return { success: true };
});

// Clear entire cache (for admin use)
export const clearAllToolCache = createServerFn('POST', async () => {
  toolEnabledCache.clear();
  return { success: true, message: 'Cache limpo com sucesso' };
});
