// Browser-side analytics hook (fail-safe, non-blocking)
import { useEffect } from 'react';
import { trackToolUsage } from '@/lib/analytics-tracking.functions';

export function useAnalytics(toolSlug: string, language?: string) {
  useEffect(() => {
    // Fire-and-forget: never blocks render
    trackToolUsage({ data: { toolSlug, language } }).catch(() => {
      // Silently ignore all errors
    });
  }, [toolSlug, language]);
}
