// Middleware to check if a tool is enabled
// Returns 404 if tool is disabled by admin

import { createServerFn } from '@tanstack/react-start';
import { supabaseAdmin } from '@/integrations/supabase/client.server';

export const isToolEnabled = createServerFn('GET', async (toolSlug: string) => {
  try {
    const { data } = await supabaseAdmin
      .from('tool_config')
      .select('is_enabled')
      .eq('tool_slug', toolSlug)
      .single();

    // If no config exists, tool is enabled by default
    if (!data) return true;

    return data.is_enabled;
  } catch (error) {
    // On error, allow access (fail open for better UX)
    console.error('[Tool Config] Error checking if tool is enabled:', error);
    return true;
  }
});
