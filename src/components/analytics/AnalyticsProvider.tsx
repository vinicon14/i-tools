// Client-side analytics wrapper component
// Automatically adds analytics tracking to pages
'use client';

import { useEffect } from 'react';
import { useLocation } from '@tanstack/react-router';
import { useAnalytics } from '@/hooks/use-analytics';

interface AnalyticsProviderProps {
  children: React.ReactNode;
  toolSlug?: string;
}

export function AnalyticsProvider({ children, toolSlug }: AnalyticsProviderProps) {
  const location = useLocation();
  
  // Don't track admin pages
  const isAdminPage = location.pathname.startsWith('/adm');
  
  // Only track non-admin pages
  if (!isAdminPage) {
    useAnalytics(toolSlug);
  }

  return <>{children}</>;
}
