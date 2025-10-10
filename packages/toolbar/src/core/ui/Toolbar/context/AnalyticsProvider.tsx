import { createContext, useContext, useEffect, useMemo, useRef } from 'react';
import type { LDClient } from 'launchdarkly-js-client-sdk';
import { ToolbarAnalytics } from '../../../utils/analytics';

interface AnalyticsContextValue {
  analytics: ToolbarAnalytics;
}

const AnalyticsContext = createContext<AnalyticsContextValue | null>(null);

interface AnalyticsProviderProps {
  children: React.ReactNode;
  ldClient?: LDClient | null;
}

export function AnalyticsProvider({ children, ldClient }: AnalyticsProviderProps) {
  const analytics = useMemo(() => new ToolbarAnalytics(ldClient), [ldClient]);
  const hasInitialized = useRef(false);

  // Track initialization once (prevent duplicates during development)
  useEffect(() => {
    if (!hasInitialized.current) {
      analytics.trackInitialization();
      hasInitialized.current = true;
    }
  }, [analytics]);

  return <AnalyticsContext.Provider value={{ analytics }}>{children}</AnalyticsContext.Provider>;
}

export function useAnalytics(): ToolbarAnalytics {
  const context = useContext(AnalyticsContext);
  if (!context) {
    throw new Error('useAnalytics must be used within an AnalyticsProvider');
  }
  return context.analytics;
}
