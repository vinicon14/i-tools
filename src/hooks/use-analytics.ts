// Client-side analytics hook
// Automatically tracks page views and sends heartbeats
import { useEffect, useRef } from 'react';
import { useLocation } from '@tanstack/react-router';
import { trackPageView, sendHeartbeat } from '@/lib/analytics-tracking.functions';

// Generate a session ID (persists in sessionStorage)
function getSessionId(): string {
  const key = 'itools_session_id';
  let sessionId = sessionStorage.getItem(key);
  
  if (!sessionId) {
    sessionId = `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
    sessionStorage.setItem(key, sessionId);
  }
  
  return sessionId;
}

export function useAnalytics(toolSlug?: string) {
  const location = useLocation();
  const hasTracked = useRef(false);

  useEffect(() => {
    // Track page view on mount
    if (!hasTracked.current) {
      hasTracked.current = true;

      trackPageView({
        path: location.pathname,
        toolSlug,
        referrer: document.referrer,
        sessionId: getSessionId(),
      }).catch((err) => {
        console.debug('[Analytics] Failed to track page view:', err);
      });
    }

    // Send heartbeat every 30 seconds
    const heartbeatInterval = setInterval(() => {
      sendHeartbeat({
        path: location.pathname,
        toolSlug,
      }).catch((err) => {
        console.debug('[Analytics] Failed to send heartbeat:', err);
      });
    }, 30000);

    return () => {
      clearInterval(heartbeatInterval);
    };
  }, [location.pathname, toolSlug]);
}
